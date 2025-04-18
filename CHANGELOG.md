## [1.15.1](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.15.0...v1.15.1) (2025-04-09)


### Bug Fixes

* **deps:** update dependencies to latest versions ([68c2f39](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/68c2f390499b7694da6771963f856cefa0b812d6))

# [1.15.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.14.2...v1.15.0) (2025-04-04)


### Bug Fixes

* improve README clarity and accuracy ([c09711f](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/c09711fc86dd29f6018907660b891e322bf089b2))


### Features

* **pullrequests:** add code diff and diffstat display to pull request details ([ed2fd3a](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/ed2fd3a2483117989701bc37b14f8aeed1233e2b))

## [1.14.2](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.14.1...v1.14.2) (2025-04-04)


### Bug Fixes

* add remaining search functionality improvements ([163d38f](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/163d38fb5d18f3b2b7dc47cee778c48be61a23c4))
* improve search results consistency across all search types ([d5f8313](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/d5f8313df4f04287d5c97824a3db98202e428f7d))
* standardize tool registration function names to registerTools ([4f4b7c6](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/4f4b7c6dce51b750048465526f0033239af54921))

## [1.14.1](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.14.0...v1.14.1) (2025-04-03)


### Performance Improvements

* trigger new release ([9c3cd52](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/9c3cd52bf4ba820df9bb0a9f5a3b7ea6d6f90c99))

# [1.14.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.13.3...v1.14.0) (2025-04-03)


### Features

* **logging:** add file logging with session ID to ~/.mcp/data/ ([8e2eae1](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/8e2eae16cdf78579bf7925704fb958a0a97411b7))

## [1.13.3](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.13.2...v1.13.3) (2025-04-03)


### Bug Fixes

* **logger:** ensure consistent logger implementation across all projects ([30f96e9](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/30f96e96eb7576cfdac904534210915c40286aa3))

## [1.13.2](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.13.1...v1.13.2) (2025-04-03)


### Performance Improvements

* **bitbucket:** improve version handling and module exports ([76f9820](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/76f982098774f8dd22d4694c683fdd485c38112d))

## [1.13.1](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.13.0...v1.13.1) (2025-04-03)


### Bug Fixes

* update PR tool argument types for Windsurf wave 6 compatibility ([51b3824](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/51b38242cb553f77b73d025280db9cceaa2365d5)), closes [#7](https://github.com/aashari/mcp-server-atlassian-bitbucket/issues/7)

# [1.13.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.12.0...v1.13.0) (2025-04-01)


### Bug Fixes

* **cli:** rename create-pr to create-pull-request and update parameter names for consistency ([6e4dbb2](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/6e4dbb2112368544cdbf567561ef800575e91536))


### Features

* **pullrequests:** add create pull request feature to CLI and MCP tools ([73400af](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/73400af266fd787b8b216bcb3ec5058b1fa99ff9)), closes [#3](https://github.com/aashari/mcp-server-atlassian-bitbucket/issues/3)

# [1.12.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.11.1...v1.12.0) (2025-04-01)


### Bug Fixes

* **build:** remove unused skipIfNoCredentials function ([9173010](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/91730106c1a21f33879130ffb20b24d9d3731e78))
* **pr:** fix double JSON.stringify in PR comment API call ([a445dc7](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/a445dc7db71bcc6fd73f2b3bf6312686b9424ce1))


### Features

* **pr:** add CLI command and tests for PR comments ([d6d3dc2](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/d6d3dc20e3722b22f694e50e7b80542ba951ea54))

## [1.11.1](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.11.0...v1.11.1) (2025-03-29)


### Bug Fixes

* conflict ([e947249](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/e9472496062a64bd9766c3ba8b61944076d16883))

# [1.11.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.10.1...v1.11.0) (2025-03-28)


### Bug Fixes

* **cli:** standardize CLI parameter naming conventions ([fe16246](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/fe16246a550674470ce8b03441809e07c0c7016b))
* resolve TypeScript errors and lint warnings in Bitbucket MCP server ([29446b9](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/29446b95151e3462f2bef3cd1f772e9726c97a29))
* standardize status parameter and workspace identifiers ([c11b2bf](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/c11b2bf5b6cf7f4e3b0eae189c17f300d64c5534))
* **test:** improve Bitbucket workspaces integration tests with better error handling and reliability ([284447f](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/284447f0897c9e53c271777d2f81178a65e32ca9))
* **tests:** improve test resiliency for CLI commands ([7f690ba](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/7f690ba4f3c42fb2f8bce6cf279ccfb5dc419a74))


### Features

* standardize CLI flag patterns and entity parameter naming ([7b4d719](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/7b4d71948d3bf6a4b2cf8659e42b02e57b92f451))
* **test:** add comprehensive test coverage for Bitbucket MCP server ([b69fa8f](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/b69fa8f171efbe713f42e9cfde013a83898419dd))

## [1.10.1](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.10.0...v1.10.1) (2025-03-28)


### Performance Improvements

* rename tools to use underscore instead of hyphen ([bc1f65e](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/bc1f65e7d76d3c13f4fd96cde115c441c7d6212f))

# [1.10.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.9.1...v1.10.0) (2025-03-27)


### Bug Fixes

* remove sort option from Bitbucket workspaces endpoints, API does not support sorting ([e6ccd9b](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/e6ccd9b7e78d6316dbbfa7def756b6897550ff29))
* standardize patterns across MCP server projects ([78ca874](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/78ca8748ba2b639e52e13bfc361c91d9573e1340))
* trigger new release ([63b2025](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/63b2025127c509e7db2d82945717b49ea223d77d))
* update applyDefaults utility to work with TypeScript interfaces ([2f682ca](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/2f682cacef284ebeb9d2f40577209bf6b45ad1d9))
* update version to 1.10.0 to fix CI/CD workflows ([938f481](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/938f48109fc1a93c7375495d08598dca044a2235))


### Features

* update to version 1.11.0 with new repository command documentation ([0a714df](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/0a714df36671f1a9bd94c90cab9d462cb90105ec))

## [1.9.2](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.9.1...v1.9.2) (2025-03-27)


### Bug Fixes

* remove sort option from Bitbucket workspaces endpoints, API does not support sorting ([e6ccd9b](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/e6ccd9b7e78d6316dbbfa7def756b6897550ff29))
* standardize patterns across MCP server projects ([78ca874](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/78ca8748ba2b639e52e13bfc361c91d9573e1340))
* trigger new release ([63b2025](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/63b2025127c509e7db2d82945717b49ea223d77d))
* update applyDefaults utility to work with TypeScript interfaces ([2f682ca](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/2f682cacef284ebeb9d2f40577209bf6b45ad1d9))
* update version to 1.10.0 to fix CI/CD workflows ([938f481](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/938f48109fc1a93c7375495d08598dca044a2235))

## [1.9.2](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.9.1...v1.9.2) (2025-03-27)


### Bug Fixes

* remove sort option from Bitbucket workspaces endpoints, API does not support sorting ([e6ccd9b](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/e6ccd9b7e78d6316dbbfa7def756b6897550ff29))
* standardize patterns across MCP server projects ([78ca874](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/78ca8748ba2b639e52e13bfc361c91d9573e1340))
* trigger new release ([63b2025](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/63b2025127c509e7db2d82945717b49ea223d77d))
* update applyDefaults utility to work with TypeScript interfaces ([2f682ca](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/2f682cacef284ebeb9d2f40577209bf6b45ad1d9))

## [1.9.1](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.9.0...v1.9.1) (2025-03-27)


### Bug Fixes

* **error:** standardize error handling across all MCP servers ([76834af](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/76834aff1d716e3e2caf210f667df65dfd21d466))

# [1.9.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.8.1...v1.9.0) (2025-03-27)


### Features

* **logger:** implement contextual logging pattern ([d6f16b7](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/d6f16b76513990dce1e6d68c32767331d075c78b))

## [1.8.1](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.8.0...v1.8.1) (2025-03-27)


### Bug Fixes

* trigger release ([43a4d06](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/43a4d069c3702f748a751f6f8a5d8b8ff425f5ab))

# [1.8.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.7.3...v1.8.0) (2025-03-26)


### Features

* **bitbucket:** add default -updated_on sort to list operations ([ee5dbca](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/ee5dbcae32484b61e67f5852e21d5e63ed2ea4a4))
* **bitbucket:** add pull request comments and enhance repository details ([72a91c8](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/72a91c89c7ce54aedbdf457ba818af83414c43a6))

## [1.7.3](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.7.2...v1.7.3) (2025-03-26)


### Bug Fixes

* empty commit to trigger patch version bump ([260911a](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/260911a1a2927aaadbe38e77fe04281a45d75334))

## [1.7.2](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.7.1...v1.7.2) (2025-03-26)


### Bug Fixes

* improve CLI and tool descriptions with consistent formatting and detailed guidance ([ce74835](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/ce748354d84f7649d71a230b8e66e80c41547f34))

## [1.7.1](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.7.0...v1.7.1) (2025-03-26)


### Bug Fixes

* standardize parameter naming conventions in Bitbucket module ([458a6e2](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/458a6e2ce714420794a83b334476c135353639fb))

# [1.7.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.6.0...v1.7.0) (2025-03-26)


### Features

* trigger release with semantic versioning ([f4895b8](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/f4895b82f93d842bf777c59e2707aeedb64fd30c))

# [1.6.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.5.0...v1.6.0) (2025-03-26)


### Features

* standardize CLI flags for consistent naming patterns ([b2ee0ba](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/b2ee0ba05dbd386ee3adb42c3fe82287d2b735ab))

# [1.5.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.4.2...v1.5.0) (2025-03-26)


### Features

* improve CLI interface by using named parameters instead of positional arguments ([99318be](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/99318bee1cc2f4706b63072800431e43b0c051a4))

## [1.4.2](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.4.1...v1.4.2) (2025-03-26)


### Bug Fixes

* standardize CLI pagination and query parameter names ([e116b25](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/e116b2582eda41f2241bf71454f82fcd2a6bdad0))

## [1.4.1](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.4.0...v1.4.1) (2025-03-25)


### Bug Fixes

* replace any with unknown in defaults.util.ts ([5dbc0b1](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/5dbc0b1050df479ac844907ef1ed26fc26734561))

# [1.4.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.3.0...v1.4.0) (2025-03-25)


### Features

* **pagination:** standardize pagination display across all CLI commands ([34f4c91](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/34f4c91f8aeb5c00d56d6975b8fa4c3ee81f4a9a))

# [1.3.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.2.0...v1.3.0) (2025-03-25)


### Features

* **format:** implement standardized formatters and update CLI documentation ([9770402](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/9770402096de6b6dffda263b976f7dbf4f4a9ee4))

# [1.2.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.1.1...v1.2.0) (2025-03-25)


### Bug Fixes

* standardize logging patterns and fix linter and type errors ([368df0f](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/368df0f602e29eea982628ddbc6f4f0702a6fab7))


### Features

* **workspaces:** improve workspace and repository management ([f27daf2](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/f27daf2238362c897ca2990a252d268e9d005484))

## [1.1.1](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.1.0...v1.1.1) (2025-03-25)


### Bug Fixes

* trigger new release for parameter and pagination standardization ([5607ce9](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/5607ce91179b33ee9f3457e5150608300072a5f9))
* update CLI and tool handlers to use object-based identifiers ([2899adc](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/2899adc38e2b804bc85098aef1f0a26caa90f5aa))

# [1.1.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.0.0...v1.1.0) (2025-03-25)


### Bug Fixes

* conflict ([91d2720](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/91d27204fdb7029d5fdd49282dbdfbdfe6da9090))
* conflict ([bccabbf](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/bccabbf44991eda2c91de592d2662f614adf4fb2))
* improve documentation with additional section ([6849f9b](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/6849f9b2339c049e0017ef40aedadd184350cee0))
* remove dist directory from git tracking ([7343e65](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/7343e65746001cb3465f9d0b0db30297ee43fb09))
* remove dist files from release commit assets ([74e53ce](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/74e53cee60c6a7785561354c81cbdf611323df5a))
* version consistency and release workflow improvements ([1a2baae](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/1a2baae4326163c8caf4fa4cfeb9f4b8028d2b5a))


### Features

* enhance get-space command to support both numeric IDs and space keys ([2913153](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/29131536f302abf1923c0c6521d544c51ad222fa))

# 1.0.0 (2025-03-24)

### Bug Fixes

- add workflows permission to semantic-release workflow ([de3a335](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/de3a33510bd447af353444db1fcb58e1b1aa02e4))
- correct package name and version consistency ([374a660](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/374a660e88a62b9c7b7c59718beec09806c47c0e))
- ensure executable permissions for bin script ([395f1dc](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/395f1dcb5f3b5efee99048d1b91e3b083e9e544f))
- handle empty strings properly in greet function ([546d3a8](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/546d3a84209e1065af46b2213053f589340158df))
- improve documentation with additional section ([ccbd814](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/ccbd8146ef55bed1edb6ed005f923ac25bfa8dae))
- improve error logging with IP address details ([121f516](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/121f51655517ddbea7d25968372bd6476f1b3e0f))
- improve GitHub Packages publishing with a more robust approach ([fd2aec9](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/fd2aec9926cf99d301cbb2b5f5ca961a6b6fec7e))
- improve GitHub Packages publishing with better error handling and debugging ([db25f04](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/db25f04925e884349fcf3ab85316550fde231d1f))
- improve GITHUB_OUTPUT syntax in semantic-release workflow ([6f154bc](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/6f154bc43f42475857e9256b0a671c3263dc9708))
- improve version detection for global installations ([97a95dc](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/97a95dca61d8cd7a86c81bde4cb38c509b810dc0))
- make publish workflow more resilient against version conflicts ([ffd3705](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/ffd3705bc064ee9135402052a0dc7fe32645714b))
- remove dist directory from git tracking ([0ed5d4b](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/0ed5d4bad05e09cbae3350eb934c98ef1d28ed12))
- remove dist files from release commit assets ([86e486b](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/86e486bb68cb18d077852e73eabf8f912d9d007e))
- remove incorrect limit expectation in transport utility tests ([6f7b689](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/6f7b689a7eb5db8a8592db88e7fa27ac04d641c8))
- remove invalid workflows permission ([c012e46](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/c012e46a29070c8394f7ab596fe7ba68c037d3a3))
- remove type module to fix CommonJS compatibility ([8b1f00c](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/8b1f00c37467bc676ad8ec9ab672ba393ed084a9))
- resolve linter errors in version detection code ([5f1f33e](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/5f1f33e88ae843b7a0d708899713be36fcd2ec2e))
- update examples to use correct API (greet instead of sayHello) ([7c062ca](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/7c062ca42765c659f018f990f4b1ec563d1172d3))
- update package name in config loader ([3b8157b](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/3b8157b076441e4dde562cddfe31671f3696434d))
- update package.json version and scripts, fix transport.util.test.ts, update README ([deefccd](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/deefccdc93311be572abf45feb9a5aae69ed57eb))
- update release workflow to ensure correct versioning in compiled files ([a365394](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/a365394b8596defa33ff5a44583d52e2c43f0aa3))
- update version display in CLI ([2b7846c](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/2b7846cbfa023f4b1a8c81ec511370fa8f5aaf33))

### Features

- add automated dependency management ([efa1b62](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/efa1b6292e0e9b6efd0d43b40cf7099d50769487))
- add CLI usage examples for both JavaScript and TypeScript ([d5743b0](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/d5743b07a6f2afe1c6cb0b03265228cba771e657))
- add support for custom name in greet command ([be48a05](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/be48a053834a1d910877864608a5e9942d913367))
- add version update script and fix version display ([ec831d3](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/ec831d3a3c966d858c15972365007f9dfd6115b8))
- implement Atlassian Bitbucket MCP server with pull request, repository, and workspace features ([a9ff1c9](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/a9ff1c9ddecaa323ffdbd6620bd5bc02b517079b))
- implement Atlassian Confluence MCP server ([50ee69e](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/50ee69e37f4d453cb8f0447e10fa5708a787aa93))
- implement review recommendations ([a23cbc0](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/a23cbc0608a07e202396b3cd496c1f2078e304c1))
- implement testing, linting, and semantic versioning ([1d7710d](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/1d7710dfa11fd1cb04ba3c604e9a2eb785652394))
- improve CI workflows with standardized Node.js version, caching, and dual publishing ([0dc9470](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/0dc94705c81067d7ff63ab978ef9e6a6e3f75784))
- improve development workflow and update documentation ([4458957](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/445895777be6287a624cb19b8cd8a12590a28c7b))
- improve package structure and add better examples ([bd66891](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/bd668915bde84445161cdbd55ff9da0b0af51944))
- initial implementation of Jira MCP server ([79e4651](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/79e4651ddf322d2dcc93d2a4aa2bd1294266550b))

### Reverts

- restore simple version handling ([bd0fadf](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/bd0fadfa8207b4a7cf472c3b9f4ee63d8e36189d))

## [1.1.4](https://github.com/aashari/mcp-server-atlassian-jira/compare/v1.1.3...v1.1.4) (2025-03-24)

### Bug Fixes

- remove dist directory from git tracking ([0ed5d4b](https://github.com/aashari/mcp-server-atlassian-jira/commit/0ed5d4bad05e09cbae3350eb934c98ef1d28ed12))

## [1.1.3](https://github.com/aashari/mcp-server-atlassian-jira/compare/v1.1.2...v1.1.3) (2025-03-24)

### Bug Fixes

- remove dist files from release commit assets ([86e486b](https://github.com/aashari/mcp-server-atlassian-jira/commit/86e486bb68cb18d077852e73eabf8f912d9d007e))

## [1.1.2](https://github.com/aashari/mcp-server-atlassian-jira/compare/v1.1.1...v1.1.2) (2025-03-24)

### Bug Fixes

- correct package name and version consistency ([374a660](https://github.com/aashari/mcp-server-atlassian-jira/commit/374a660e88a62b9c7b7c59718beec09806c47c0e))

## [1.1.1](https://github.com/aashari/mcp-server-atlassian-jira/compare/v1.1.0...v1.1.1) (2025-03-24)

### Bug Fixes

- improve documentation with additional section ([ccbd814](https://github.com/aashari/mcp-server-atlassian-jira/commit/ccbd8146ef55bed1edb6ed005f923ac25bfa8dae))

# [1.1.0](https://github.com/aashari/mcp-server-atlassian-jira/compare/v1.0.0...v1.1.0) (2025-03-23)

### Bug Fixes

- remove incorrect limit expectation in transport utility tests ([6f7b689](https://github.com/aashari/mcp-server-atlassian-jira/commit/6f7b689a7eb5db8a8592db88e7fa27ac04d641c8))
- update package.json version and scripts, fix transport.util.test.ts, update README ([deefccd](https://github.com/aashari/mcp-server-atlassian-jira/commit/deefccdc93311be572abf45feb9a5aae69ed57eb))

### Features

- improve development workflow and update documentation ([4458957](https://github.com/aashari/mcp-server-atlassian-jira/commit/445895777be6287a624cb19b8cd8a12590a28c7b))

# 1.0.0 (2025-03-23)

### Bug Fixes

- add workflows permission to semantic-release workflow ([de3a335](https://github.com/aashari/mcp-server-atlassian-jira/commit/de3a33510bd447af353444db1fcb58e1b1aa02e4))
- ensure executable permissions for bin script ([395f1dc](https://github.com/aashari/mcp-server-atlassian-jira/commit/395f1dcb5f3b5efee99048d1b91e3b083e9e544f))
- handle empty strings properly in greet function ([546d3a8](https://github.com/aashari/mcp-server-atlassian-jira/commit/546d3a84209e1065af46b2213053f589340158df))
- improve error logging with IP address details ([121f516](https://github.com/aashari/mcp-server-atlassian-jira/commit/121f51655517ddbea7d25968372bd6476f1b3e0f))
- improve GitHub Packages publishing with a more robust approach ([fd2aec9](https://github.com/aashari/mcp-server-atlassian-jira/commit/fd2aec9926cf99d301cbb2b5f5ca961a6b6fec7e))
- improve GitHub Packages publishing with better error handling and debugging ([db25f04](https://github.com/aashari/mcp-server-atlassian-jira/commit/db25f04925e884349fcf3ab85316550fde231d1f))
- improve GITHUB_OUTPUT syntax in semantic-release workflow ([6f154bc](https://github.com/aashari/mcp-server-atlassian-jira/commit/6f154bc43f42475857e9256b0a671c3263dc9708))
- improve version detection for global installations ([97a95dc](https://github.com/aashari/mcp-server-atlassian-jira/commit/97a95dca61d8cd7a86c81bde4cb38c509b810dc0))
- make publish workflow more resilient against version conflicts ([ffd3705](https://github.com/aashari/mcp-server-atlassian-jira/commit/ffd3705bc064ee9135402052a0dc7fe32645714b))
- remove invalid workflows permission ([c012e46](https://github.com/aashari/mcp-server-atlassian-jira/commit/c012e46a29070c8394f7ab596fe7ba68c037d3a3))
- remove type module to fix CommonJS compatibility ([8b1f00c](https://github.com/aashari/mcp-server-atlassian-jira/commit/8b1f00c37467bc676ad8ec9ab672ba393ed084a9))
- resolve linter errors in version detection code ([5f1f33e](https://github.com/aashari/mcp-server-atlassian-jira/commit/5f1f33e88ae843b7a0d708899713be36fcd2ec2e))
- update examples to use correct API (greet instead of sayHello) ([7c062ca](https://github.com/aashari/mcp-server-atlassian-jira/commit/7c062ca42765c659f018f990f4b1ec563d1172d3))
- update package name in config loader ([3b8157b](https://github.com/aashari/mcp-server-atlassian-jira/commit/3b8157b076441e4dde562cddfe31671f3696434d))
- update release workflow to ensure correct versioning in compiled files ([a365394](https://github.com/aashari/mcp-server-atlassian-jira/commit/a365394b8596defa33ff5a44583d52e2c43f0aa3))
- update version display in CLI ([2b7846c](https://github.com/aashari/mcp-server-atlassian-jira/commit/2b7846cbfa023f4b1a8c81ec511370fa8f5aaf33))

### Features

- add automated dependency management ([efa1b62](https://github.com/aashari/mcp-server-atlassian-jira/commit/efa1b6292e0e9b6efd0d43b40cf7099d50769487))
- add CLI usage examples for both JavaScript and TypeScript ([d5743b0](https://github.com/aashari/mcp-server-atlassian-jira/commit/d5743b07a6f2afe1c6cb0b03265228cba771e657))
- add support for custom name in greet command ([be48a05](https://github.com/aashari/mcp-server-atlassian-jira/commit/be48a053834a1d910877864608a5e9942d913367))
- add version update script and fix version display ([ec831d3](https://github.com/aashari/mcp-server-atlassian-jira/commit/ec831d3a3c966d858c15972365007f9dfd6115b8))
- implement Atlassian Confluence MCP server ([50ee69e](https://github.com/aashari/mcp-server-atlassian-jira/commit/50ee69e37f4d453cb8f0447e10fa5708a787aa93))
- implement review recommendations ([a23cbc0](https://github.com/aashari/mcp-server-atlassian-jira/commit/a23cbc0608a07e202396b3cd496c1f2078e304c1))
- implement testing, linting, and semantic versioning ([1d7710d](https://github.com/aashari/mcp-server-atlassian-jira/commit/1d7710dfa11fd1cb04ba3c604e9a2eb785652394))
- improve CI workflows with standardized Node.js version, caching, and dual publishing ([0dc9470](https://github.com/aashari/mcp-server-atlassian-jira/commit/0dc94705c81067d7ff63ab978ef9e6a6e3f75784))
- improve package structure and add better examples ([bd66891](https://github.com/aashari/mcp-server-atlassian-jira/commit/bd668915bde84445161cdbd55ff9da0b0af51944))
- initial implementation of Jira MCP server ([79e4651](https://github.com/aashari/mcp-server-atlassian-jira/commit/79e4651ddf322d2dcc93d2a4aa2bd1294266550b))

### Reverts

- restore simple version handling ([bd0fadf](https://github.com/aashari/mcp-server-atlassian-jira/commit/bd0fadfa8207b4a7cf472c3b9f4ee63d8e36189d))

## [1.0.1](https://github.com/aashari/mcp-server-atlassian-confluence/compare/v1.0.0...v1.0.1) (2025-03-23)

### Bug Fixes

- update package name in config loader ([3b8157b](https://github.com/aashari/mcp-server-atlassian-confluence/commit/3b8157b076441e4dde562cddfe31671f3696434d))

# 1.0.0 (2025-03-23)

### Bug Fixes

- add workflows permission to semantic-release workflow ([de3a335](https://github.com/aashari/mcp-server-atlassian-confluence/commit/de3a33510bd447af353444db1fcb58e1b1aa02e4))
- ensure executable permissions for bin script ([395f1dc](https://github.com/aashari/mcp-server-atlassian-confluence/commit/395f1dcb5f3b5efee99048d1b91e3b083e9e544f))
- handle empty strings properly in greet function ([546d3a8](https://github.com/aashari/mcp-server-atlassian-confluence/commit/546d3a84209e1065af46b2213053f589340158df))
- improve error logging with IP address details ([121f516](https://github.com/aashari/mcp-server-atlassian-confluence/commit/121f51655517ddbea7d25968372bd6476f1b3e0f))
- improve GitHub Packages publishing with a more robust approach ([fd2aec9](https://github.com/aashari/mcp-server-atlassian-confluence/commit/fd2aec9926cf99d301cbb2b5f5ca961a6b6fec7e))
- improve GitHub Packages publishing with better error handling and debugging ([db25f04](https://github.com/aashari/mcp-server-atlassian-confluence/commit/db25f04925e884349fcf3ab85316550fde231d1f))
- improve GITHUB_OUTPUT syntax in semantic-release workflow ([6f154bc](https://github.com/aashari/mcp-server-atlassian-confluence/commit/6f154bc43f42475857e9256b0a671c3263dc9708))
- improve version detection for global installations ([97a95dc](https://github.com/aashari/mcp-server-atlassian-confluence/commit/97a95dca61d8cd7a86c81bde4cb38c509b810dc0))
- make publish workflow more resilient against version conflicts ([ffd3705](https://github.com/aashari/mcp-server-atlassian-confluence/commit/ffd3705bc064ee9135402052a0dc7fe32645714b))
- remove invalid workflows permission ([c012e46](https://github.com/aashari/mcp-server-atlassian-confluence/commit/c012e46a29070c8394f7ab596fe7ba68c037d3a3))
- remove type module to fix CommonJS compatibility ([8b1f00c](https://github.com/aashari/mcp-server-atlassian-confluence/commit/8b1f00c37467bc676ad8ec9ab672ba393ed084a9))
- resolve linter errors in version detection code ([5f1f33e](https://github.com/aashari/mcp-server-atlassian-confluence/commit/5f1f33e88ae843b7a0d708899713be36fcd2ec2e))
- update examples to use correct API (greet instead of sayHello) ([7c062ca](https://github.com/aashari/mcp-server-atlassian-confluence/commit/7c062ca42765c659f018f990f4b1ec563d1172d3))
- update release workflow to ensure correct versioning in compiled files ([a365394](https://github.com/aashari/mcp-server-atlassian-confluence/commit/a365394b8596defa33ff5a44583d52e2c43f0aa3))
- update version display in CLI ([2b7846c](https://github.com/aashari/mcp-server-atlassian-confluence/commit/2b7846cbfa023f4b1a8c81ec511370fa8f5aaf33))

### Features

- add automated dependency management ([efa1b62](https://github.com/aashari/mcp-server-atlassian-confluence/commit/efa1b6292e0e9b6efd0d43b40cf7099d50769487))
- add CLI usage examples for both JavaScript and TypeScript ([d5743b0](https://github.com/aashari/mcp-server-atlassian-confluence/commit/d5743b07a6f2afe1c6cb0b03265228cba771e657))
- add support for custom name in greet command ([be48a05](https://github.com/aashari/mcp-server-atlassian-confluence/commit/be48a053834a1d910877864608a5e9942d913367))
- add version update script and fix version display ([ec831d3](https://github.com/aashari/mcp-server-atlassian-confluence/commit/ec831d3a3c966d858c15972365007f9dfd6115b8))
- implement Atlassian Confluence MCP server ([50ee69e](https://github.com/aashari/mcp-server-atlassian-confluence/commit/50ee69e37f4d453cb8f0447e10fa5708a787aa93))
- implement review recommendations ([a23cbc0](https://github.com/aashari/mcp-server-atlassian-confluence/commit/a23cbc0608a07e202396b3cd496c1f2078e304c1))
- implement testing, linting, and semantic versioning ([1d7710d](https://github.com/aashari/mcp-server-atlassian-confluence/commit/1d7710dfa11fd1cb04ba3c604e9a2eb785652394))
- improve CI workflows with standardized Node.js version, caching, and dual publishing ([0dc9470](https://github.com/aashari/mcp-server-atlassian-confluence/commit/0dc94705c81067d7ff63ab978ef9e6a6e3f75784))
- improve package structure and add better examples ([bd66891](https://github.com/aashari/mcp-server-atlassian-confluence/commit/bd668915bde84445161cdbd55ff9da0b0af51944))

### Reverts

- restore simple version handling ([bd0fadf](https://github.com/aashari/mcp-server-atlassian-confluence/commit/bd0fadfa8207b4a7cf472c3b9f4ee63d8e36189d))

# 1.0.0 (2025-03-23)

### Features

- Initial release of Atlassian Confluence MCP server
- Provides tools for accessing and searching Confluence spaces, pages, and content
- Integration with Claude Desktop and Cursor AI via Model Context Protocol
- CLI support for direct interaction with Confluence
