install:
	npm install; \
	./node_modules/.bin/bower install; \
	./node_modules/.bin/component install

app:
	rm -rf app/build/TermKit.app/Contents/Resources/HTML/*; \
	rm -rf app/build/TermKit.app/Contents/Resources/shared/*; \
	cp -r src/public/* app/build/TermKit.app/Contents/Resources/HTML; \
	cp -r src/shared/* app/build/TermKit.app/Contents/Resources/shared;

build:
	./node_modules/.bin/component build -o src/public/build

start:
	open app/build/TermKit.app & node src/nodekit.js

.PHONY: install app build start