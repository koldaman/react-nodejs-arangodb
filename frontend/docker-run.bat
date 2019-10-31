docker run -it -v //C/private/sample/frontend:/app -v //C/private/sample/frontend/node_modules -v //C/private/sample/frontend/package.json -e CHOKIDAR_USEPOLLING=true -p 3000:3000 --rm sample:dev
