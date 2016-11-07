THIS_FILE	:= $(lastword $(MAKEFILE_LIST))
ROOT_DIR	:= $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))
NOW		:= $(shell date +%FT%T%z)
SRC_DIR 	:= $(ROOT_DIR)/src
BUILD_DIR 	:= $(ROOT_DIR)/build

define GetFromPkg
$(shell node -p "require('./package.json').$(1)")
endef

PROJECT		:= $(call GetFromPkg,name)
LAST_VERSION	:= $(call GetFromPkg,version)
DESCRIPTION	:= $(call GetFromPkg,description)
PROJECT_URL	:= $(call GetFromPkg,homepage)

JS_SRC 		:= $(SRC_DIR)/js
SASS_SRC 	:= $(SRC_DIR)/scss
SASS_VENDOR_SRC	:= $(SASS_SRC)/vendor

SASS_MAIN_FILE 	:= $(SASS_SRC)/main.scss

JS_DEBUG	:= $(ROOT_DIR)/$(call GetFromPkg,rollup.dest)
JS_FINAL	:= $(ROOT_DIR)/$(call GetFromPkg,main)
CSS_COMBINED 	:= $(BUILD_DIR)/$(PROJECT).css
CSS_FINAL 	:= $(BUILD_DIR)/$(PROJECT).min.css
TMPFILE 	:= $(BUILD_DIR)/tmp

NODE_MODULES	:= ./node_modules/.bin

CLEANCSS 	:= $(NODE_MODULES)/cleancss
CLEANCSSFLAGS 	:= --skip-restructuring

POSTCSS 	:= $(NODE_MODULES)/postcss
POSTCSSFLAGS 	:= --use autoprefixer -b "last 3 versions, ie >= 9" --replace

ESLINT 		:= $(NODE_MODULES)/eslint
UGLIFYJS 	:= $(NODE_MODULES)/uglifyjs
UGLIFYJSFLAGS 	:= --mangle --mangle-regex --screw-ie8 -c warnings=false

NODEMON 	:= $(NODE_MODULES)/nodemon
PARALLELSHELL 	:= $(NODE_MODULES)/parallelshell
SASS	 	:= $(NODE_MODULES)/node-sass
SASSFLAGS	:= --importer node_modules/node-sass-json-importer/dist/node-sass-json-importer.js

ROLLUP	 	:= $(NODE_MODULES)/rollup
ROLLUPFLAGS 	:= -c rollup.config.js

define HEADER
/**
 * $(DESCRIPTION)
 * $(PROJECT_URL)
 * Version: v$(LAST_VERSION)
 * Built: $(NOW)
 */

endef
export HEADER

# targets
.PHONY: default
default: help

.PHONY: help
help:
	@echo
	@echo "The most common targets are:"
	@echo
	@echo "- install                 Install node dependencies"
	@echo "- build                   Build JavaScript and CSS files"
	@echo "- build-watch             Build files and watch for modifications"
	@echo "- test                    Run unit tests in the console"
	@echo "- publish                 Increase version, commit, push and publish"
	@echo "- help                    Display this help message"
	@echo
	@echo "Other less frequently used targets are:"
	@echo
	@echo "- lint                    Check the code with the linter"
	@echo "- build-js                Build JavaScript files"
	@echo "- build-css               Build CSS files"
	@echo

.PHONY: npm-install
npm-install: install

$(BUILD_DIR)/timestamps/node-modules-timestamp: package.json
	@mkdir -p $(@D)
	yarn install
	@touch $@

.PHONY: install
install: $(BUILD_DIR)/timestamps/node-modules-timestamp

.PHONY: publish
publish:
	@if [ ! "$(RELEASE_TYPE)" ]; then \
		echo ""; \
		echo "Release type was not specified!"; \
		echo "Usage: make publish RELEASE_TYPE=\"major|minor|patch\""; \
		echo ""; \
		return 1; \
	fi
	@$(MAKE) test
	$(eval NEXT_VERSION := $(shell npm version $(RELEASE_TYPE) --no-git-tag-version))
	@$(MAKE) -f $(THIS_FILE) build
	@git add .
	@git commit -m "Bump to $(NEXT_VERSION)"
	@git tag -a $(NEXT_VERSION) -m "Bump to $(NEXT_VERSION)"
	@git push && git push origin $(NEXT_VERSION) && npm publish

.PHONY: test
test: build

.PHONY: build-watch
build-watch: build watch

.PHONY: watch
watch:
	$(PARALLELSHELL) "make watch-js" "make watch-sass"

.PHONY: build
build: install clean build-js build-css

.PHONY: clean
clean:
	@rm -f $(BUILD_DIR)/timestamps/eslint-timestamp
	@rm -fr $(BUILD_DIR)

.PHONY: build-js
build-js: bundle-js lint uglifyjs add-js-header
	@echo `date +'%H:%M:%S'` "Build JS ... OK"

.PHONY: build-css
build-css: compile-sass prefix-css cleancss add-css-header
	@echo `date +'%H:%M:%S'` "Build CSS ... OK"

.PHONY: compile-sass
compile-sass: $(SASS_MAIN_FILE)
	@mkdir -p $(BUILD_DIR)
	@$(SASS) $(SASSFLAGS) $^ $(CSS_COMBINED)

.PHONY: prefix-css
prefix-css: $(CSS_COMBINED)
	@$(POSTCSS) $(POSTCSSFLAGS) $^

.PHONY: cleancss
cleancss: $(CSS_COMBINED)
	@cat $^ | $(CLEANCSS) $(CLEANCSSFLAGS) > $(CSS_FINAL)

.PHONY: bundle-js
bundle-js:
	@mkdir -p $(BUILD_DIR)
	@$(ROLLUP) $(ROLLUPFLAGS)

$(BUILD_DIR)/timestamps/eslint-timestamp: $(SRC_DIR)
	@mkdir -p $(@D)
	@echo "Running eslint ..."
	@$(ESLINT) $^
	@touch $@

.PHONY: lint
lint: $(BUILD_DIR)/timestamps/eslint-timestamp

.PHONY: uglifyjs
uglifyjs: $(JS_DEBUG)
	@$(UGLIFYJS) $^ $(UGLIFYJSFLAGS) > $(JS_FINAL)

.PHONY: add-js-header-debug
add-js-header-debug: $(JS_DEBUG)
	@echo "$$HEADER" | cat - $^ > $(TMPFILE) && mv $(TMPFILE) $^

.PHONY: add-js-header-min
add-js-header-min: $(JS_FINAL)
	@echo "$$HEADER" | cat - $^ > $(TMPFILE) && mv $(TMPFILE) $^

.PHONY: add-js-header
add-js-header: add-js-header-debug add-js-header-min

.PHONY: add-css-header-debug
add-css-header-debug: $(CSS_COMBINED)
	@echo "$$HEADER" | cat - $^ > $(TMPFILE) && mv $(TMPFILE) $^

.PHONY: add-css-header-min
add-css-header-min: $(CSS_FINAL)
	@echo "$$HEADER" | cat - $^ > $(TMPFILE) && mv $(TMPFILE) $^

.PHONY: add-css-header
add-css-header: add-css-header-debug add-css-header-min

.PHONY: watch-js
watch-js: $(JS_SRC)
	@$(NODEMON) --on-change-only --watch $^ --ext js --exec "make build-js"

.PHONY: watch-sass
watch-sass: $(SASS_SRC)
	@$(NODEMON) --on-change-only --watch $^ --ext scss --ignore $(SASS_VENDOR_SRC) --exec "make build-css"
	
.DEFAULT_GOAL := default
