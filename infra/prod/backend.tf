terraform {
  backend "s3" {
    bucket       = "christiangohring-terraform-state"
    key          = "blog/prod/terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true
  }
}
