# ============================================================
# Makefile para mi-blog (Astro)
# Uso: make <target>
# ============================================================

.PHONY: install dev build preview clean

# Instala dependencias de forma determinista.
# Equivalente a pip-sync: usa el lockfile, no resuelve versiones nuevas.
install:
	npm ci

# Arranca el servidor de desarrollo local con hot-reload.
dev:
	npm run dev

# Genera el HTML estático final en la carpeta dist/
build:
	npm run build

# Previsualiza el build final antes de subir a S3.
# Útil para verificar que el build funciona como producción.
preview:
	npm run preview

# Elimina artefactos generados. Útil para builds limpios.
clean:
	rm -rf dist/ .astro/
