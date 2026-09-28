terraform {
  required_version = ">= 1.15.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 6.0, < 7.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

locals {
  project     = "mi-blog"
  environment = "prod"
  domain      = "christiangohring.com"
}

resource "aws_s3_bucket" "blog" {
  bucket = local.domain
}

resource "aws_s3_bucket_website_configuration" "blog" {
  bucket = aws_s3_bucket.blog.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

resource "aws_s3_bucket_public_access_block" "blog" {
  bucket = aws_s3_bucket.blog.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_ownership_controls" "blog" {
  bucket = aws_s3_bucket.blog.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "blog" {
  bucket = aws_s3_bucket.blog.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }

    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_policy" "blog_public_read" {
  bucket = aws_s3_bucket.blog.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "PublicReadGetObject"
      Effect    = "Allow"
      Principal = "*"
      Action    = "s3:GetObject"
      Resource  = "${aws_s3_bucket.blog.arn}/*"
    }]
  })
}

resource "aws_cloudfront_distribution" "blog" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_All"
  http_version        = "http2"
  web_acl_id          = aws_wafv2_web_acl.blog.arn

  tags = {
    Name = "${local.domain}.s3-website-us-east-1.amazonaws.com"
  }

  aliases = [
    local.domain,
    "www.${local.domain}"
  ]

  origin {
    domain_name = "${local.domain}.s3-website-us-east-1.amazonaws.com"
    origin_id   = "${local.domain}.s3-website-us-east-1.amazonaws.com-mmj7r71z2el"

    connection_attempts         = 3
    connection_timeout          = 10
    response_completion_timeout = 0

    custom_origin_config {
      http_port                = 80
      https_port               = 443
      ip_address_type          = "ipv4"
      origin_protocol_policy   = "http-only"
      origin_ssl_protocols     = ["SSLv3", "TLSv1", "TLSv1.1", "TLSv1.2"]
      origin_read_timeout      = 30
      origin_keepalive_timeout = 5
    }
  }

  default_cache_behavior {
    target_origin_id       = "${local.domain}.s3-website-us-east-1.amazonaws.com-mmj7r71z2el"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true
    cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.blog.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}

resource "aws_route53_zone" "blog" {
  name    = local.domain
  comment = "HostedZone created by Route53 Registrar"
}

resource "aws_route53_record" "apex" {
  zone_id = aws_route53_zone.blog.zone_id
  name    = local.domain
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.blog.domain_name
    zone_id                = aws_cloudfront_distribution.blog.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.blog.zone_id
  name    = "www.${local.domain}"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.blog.domain_name
    zone_id                = aws_cloudfront_distribution.blog.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "verification_txt" {
  zone_id = aws_route53_zone.blog.zone_id
  name    = local.domain
  type    = "TXT"
  ttl     = 300

  records = ["Hola, soy el Project Lead, el dominio funciona"]
}

resource "aws_route53_record" "acm_validation_apex" {
  zone_id = aws_route53_zone.blog.zone_id
  name    = "_d2b70304ef0ae54d898b9f33102f9add.${local.domain}"
  type    = "CNAME"
  ttl     = 300

  records = ["_ba42ff02df370fe7eb2210231d923f9d.jkddzztszm.acm-validations.aws."]
}

resource "aws_route53_record" "acm_validation_www" {
  zone_id = aws_route53_zone.blog.zone_id
  name    = "_28e909d4ffc6675062cf438480424951.www.${local.domain}"
  type    = "CNAME"
  ttl     = 300

  records = ["_2582f0cb1ec705568825a1e16dffae6c.jkddzztszm.acm-validations.aws."]
}

resource "aws_acm_certificate" "blog" {
  domain_name               = local.domain
  subject_alternative_names = ["www.${local.domain}"]
  validation_method         = "DNS"
  key_algorithm             = "RSA_2048"

  options {
    certificate_transparency_logging_preference = "ENABLED"
  }

  tags = {
    Name = "christiangohring-ssl"
  }
}

resource "aws_wafv2_web_acl" "blog" {
  name  = "CreatedByCloudFront-486e82ed"
  scope = "CLOUDFRONT"

  default_action {
    allow {}
  }

  rule {
    name     = "AWS-AWSManagedRulesAmazonIpReputationList"
    priority = 0

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesAmazonIpReputationList"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      sampled_requests_enabled   = true
      cloudwatch_metrics_enabled = true
      metric_name                = "AWS-AWSManagedRulesAmazonIpReputationList"
    }
  }

  rule {
    name     = "AWS-AWSManagedRulesCommonRuleSet"
    priority = 1

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      sampled_requests_enabled   = true
      cloudwatch_metrics_enabled = true
      metric_name                = "AWS-AWSManagedRulesCommonRuleSet"
    }
  }

  rule {
    name     = "AWS-AWSManagedRulesKnownBadInputsRuleSet"
    priority = 2

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesKnownBadInputsRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      sampled_requests_enabled   = true
      cloudwatch_metrics_enabled = true
      metric_name                = "AWS-AWSManagedRulesKnownBadInputsRuleSet"
    }
  }

  visibility_config {
    sampled_requests_enabled   = true
    cloudwatch_metrics_enabled = true
    metric_name                = "CreatedByCloudFront-486e82ed"
  }
}
