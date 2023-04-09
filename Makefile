# Makefile preamble (https://tech.davis-hansson.com/p/make/)
SHELL := bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules

ifeq ($(origin .RECIPEPREFIX), undefined)
	$(error This Make does not support .RECIPEPREFIX. Please use GNU Make 4.0 or later)
endif
.RECIPEPREFIX = >

ifndef VERBOSE
MAKEFLAGS += --no-print-directory
endif

.PHONY: help all \
>	check-tool-pnpm \
>	dist install clean \
>	changelog \
>	build build-watch \
>	lint lint-watch \
>	test test-unit \
>	target-dir publish publish-prerelease

all: install build

help: ## Display this help
>	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_\-.*]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)


PNPM ?= pnpm
NPM ?= npm
TAPE ?= ./node_modules/.bin/tape
GIT ?= git

PACKAGE_NAME ?= nestjs-logger-roarr
VERSION ?= $(shell grep version package.json | cut -d ' ' -f 4 | tr -d ,\")

check-tool-pnpm:
>	@which pnpm > /dev/null || (echo -e "\n[ERROR] please install pnpm (http://pnpmpkg.com/)" && exit 1)

install: dist
>	@echo -e "=> running pnpm install..."
>	$(PNPM) install

###############
# Development #
###############

print-version: ## print project version
>	@echo -n "$(VERSION)"

CHANGELOG_FILE_PATH ?= CHANGELOG

changelog: ## generate changelog
> $(GIT) cliff --unreleased --tag=$(VERSION) --prepend=$(CHANGELOG_FILE_PATH)

build: dist ## build the project
> $(PNPM) build

build-watch: dist ## build the project (continuously)
> $(PNPM) build-watch

clean: ## clean the output directory
> rm -rf dist/*

#########
# Tests #
#########

test: test-unit test-int # run all tests

test-unit: check-tool-pnpm # run unit tests
>	$(PNPM) test-unit

test-int: check-tool-pnpm # run integration tests
>	$(PNPM) test-int

#############
# Packaging #
#############

PACKAGE_FILENAME ?= $(PACKAGE_NAME)-$(VERSION).tgz
TARGET_DIR ?= target
PACKAGE_PATH ?= $(TARGET_DIR)/$(PACKAGE_FILENAME)

target-dir:
>  mkdir -p $(TARGET_DIR)

print-package-filename: # print package filename
> @echo "$(PACKAGE_FILENAME)"

# NOTE: if you try to test this package locally (ex. using `pnpm add path/to/async-wait-for-promise-<version>.tgz`),
# you will have to `pnpm cache clean` between every update.
# as one command: `pnpm cache clean && pnpm remove async-wait-for-promise && pnpm add path/to/async-wait-for-promise-v0.1.0.tgz`
package: clean build target-dir # package the project
>	$(PNPM) pack
>	mv $(PACKAGE_FILENAME) $(TARGET_DIR)/

publish-prerelease: package # package & publish a pre-release to NPM
>	$(PNPM) publish \
	--tag pre \
	$(PACKAGE_PATH)

publish: package # package & publish to NPM
>	$(PNPM) publish \
	--tag latest \
	$(PACKAGE_PATH)
