# Wiki de findParking

Contenido preparado para la [Wiki nativa de GitHub](../../../../wiki) del repo. La wiki de GitHub necesita que alguien cree la primera página manualmente una vez (botón "Create the first page" en la pestaña Wiki) antes de poder empujarle contenido por git; hasta entonces, este contenido vive aquí, versionado junto al código.

## Páginas

- [CI/CD Pipeline (GitHub Actions)](CI-CD-Pipeline.md) — diagramas PlantUML del workflow de CI/CD.

## Migrar a la Wiki nativa

Una vez creada la primera página en GitHub:

```bash
git clone https://github.com/seminarioA/findParking.wiki.git
cp docs/wiki/*.md docs/wiki/images/* docs/wiki/diagrams/* findParking.wiki/ -r
cd findParking.wiki && git add -A && git commit -m "Importar contenido" && git push
```
