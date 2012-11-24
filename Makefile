build:
	npm install; \
	cd src/public; \
	../../node_modules/.bin/bower install; \
	cd ../../; \
	rm -rf app/build/TermKit.app/Contents/Resources/HTML/*; \
	rm -rf app/build/TermKit.app/Contents/Resources/shared/*; \
	cp -r src/public/* app/build/TermKit.app/Contents/Resources/HTML; \
	cp -r src/shared/* app/build/TermKit.app/Contents/Resources/shared;

.PHONY: build