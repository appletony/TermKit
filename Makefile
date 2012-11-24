install:
	npm install; \
	cd src/public; \
	../../node_modules/.bin/bower install; \

build:
	rm -rf app/build/TermKit.app/Contents/Resources/HTML/*; \
	rm -rf app/build/TermKit.app/Contents/Resources/shared/*; \
	cp -r src/public/* app/build/TermKit.app/Contents/Resources/HTML; \
	cp -r src/shared/* app/build/TermKit.app/Contents/Resources/shared;

start:
	open app/build/TermKit.app & node src/nodekit.js

.PHONY: build install start