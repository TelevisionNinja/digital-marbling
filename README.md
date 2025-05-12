# digital-marbling
Digital Marbling. Ink dropping and tine lines are implemented in a shader.

![screenshot](./images/screenshot.png)

## Run Server with Docker or Podman
### Docker
```bash
docker build -t marbling_image .
docker run -p 8080:80 --replace --name marbling_container marbling_image
```

### Podman
```bash
podman build -t marbling_image .
podman run -p 8080:80 --replace --name marbling_container marbling_image
```
