## [Unreleased](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.45.0...v1.45.1) (2025-11-06)


### Bug Fixes

* fix diff direction by swapping branch/commit parameters to show correct changes ([#84](https://github.com/aashari/mcp-server-atlassian-bitbucket/issues/84)) - Previously, bb_diff_branches showed what would be removed from destination instead of what source adds. Now correctly displays PR changes with additions as + and deletions as -.

# [1.45.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.44.2...v1.45.0) (2025-10-05)


### Features

* api call timeout CWE-400 ([#118](https://github.com/aashari/mcp-server-atlassian-bitbucket/issues/118)) ([d8659ee](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/d8659ee8f7d6baca1a5a391a4ee08368af63af84))

## [1.44.2](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.44.1...v1.44.2) (2025-09-09)


### Bug Fixes

* use single baseUrl for API token authentication ([#117](https://github.com/aashari/mcp-server-atlassian-bitbucket/issues/117)) ([a0d5ad1](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/a0d5ad1aa6333ab824f882de20af2e1f69540a55)), closes [#61](https://github.com/aashari/mcp-server-atlassian-bitbucket/issues/61)

## [1.44.1](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.44.0...v1.44.1) (2025-09-09)


### Bug Fixes

* Prevent dotenv from outputting to STDIO in MCP mode ([#106](https://github.com/aashari/mcp-server-atlassian-bitbucket/issues/106)) ([52a8e13](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/52a8e132e35bc215445a15d846d5c79bf49a06fc))

# [1.44.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.43.4...v1.44.0) (2025-09-09)


### Features

* modernize dependencies and ensure Zod v3.25.76 MCP SDK compatibility ([#115](https://github.com/aashari/mcp-server-atlassian-bitbucket/issues/115)) ([86ceaeb](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/86ceaebed56326d32be0736a77e3b4d528af8003))

## [1.43.4](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.43.3...v1.43.4) (2025-08-07)


### Bug Fixes

* update .env.example with complete authentication options ([52da9a1](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/52da9a1b37f71cfe6af16fe2322b8d040285718b))

## [1.43.3](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.43.2...v1.43.3) (2025-08-07)


### Bug Fixes

* correct authentication credentials and config structure ([b53b5d5](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/b53b5d569c97efb9b91ee34063b669210a2e3be5))

## [1.43.2](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.43.1...v1.43.2) (2025-08-02)


### Bug Fixes

* prevent double formatting in Bitbucket markdown (heading + bold) ([67ec325](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/67ec3253f1c3576cf8427ff6426ae3178e12f96a))

## [1.43.1](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.43.0...v1.43.1) (2025-08-02)


### Bug Fixes

* resolve bb_get_file tool failure with dynamic default branch detection ([74ca7e0](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/74ca7e0f3f042f2f24cdf156d4a94c2e3e026cf5))

# [1.43.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.42.1...v1.43.0) (2025-08-02)


### Bug Fixes

* correct logger variable name in repository list controller ([1706725](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/1706725a374826068c1d75c80e215543fb3ac4a6))


### Features

* add query logging for repository searches ([c8d776d](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/c8d776dcabf8dab4cc63724df508b3837e993cc0))

## [1.42.1](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.42.0...v1.42.1) (2025-08-02)


### Bug Fixes

* standardize dependencies and fix TypeScript linting issues ([4e5ab79](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/4e5ab79431f07da5bd06db0fa5835191ccb2ef08))

# [1.42.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.41.1...v1.42.0) (2025-07-15)


### Features

* add support for threaded comments in pull request comments ([#50](https://github.com/aashari/mcp-server-atlassian-bitbucket/issues/50)) ([6bcb98a](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/6bcb98ad95c7073604c6f5173e78c7339821e689)), closes [#49](https://github.com/aashari/mcp-server-atlassian-bitbucket/issues/49)

## [1.41.1](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.41.0...v1.41.1) (2025-06-22)


### Bug Fixes

* change default transport from HTTP to STDIO for proper MCP client integration ([51d9a1c](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/51d9a1c91490b47ea3498a11fdd4a3fd35940792))

# [1.41.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.40.1...v1.41.0) (2025-06-22)


### Features

* implement complete PR CRUD operations (update, approve, reject) ([de5a2a0](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/de5a2a045cab06f0ce2a2bbfdd9028bae81d2b73)), closes [#38](https://github.com/aashari/mcp-server-atlassian-bitbucket/issues/38) [#39](https://github.com/aashari/mcp-server-atlassian-bitbucket/issues/39) [#38](https://github.com/aashari/mcp-server-atlassian-bitbucket/issues/38) [#39](https://github.com/aashari/mcp-server-atlassian-bitbucket/issues/39)

## [1.40.1](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.40.0...v1.40.1) (2025-06-22)


### Bug Fixes

* update dependencies ([dac5279](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/dac5279c7e5eb2c80adc33ae594c25af942c551b))

# [1.40.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.39.7...v1.40.0) (2025-06-22)


### Features

* add dual transport support (HTTP + STDIO) for MCP server ([313de85](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/313de85ff2be8e37db498a197aa7d873ddb6912e))

## [1.39.7](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.39.6...v1.39.7) (2025-06-02)


### Bug Fixes

* replace Unix-specific chmod with cross-platform ensure-executable script ([0140fb5](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/0140fb59a3bdc15c009a65e9384c49f9e9c7710b)), closes [#31](https://github.com/aashari/mcp-server-atlassian-bitbucket/issues/31)

## [1.39.6](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.39.5...v1.39.6) (2025-06-02)


### Bug Fixes

* update dependencies ([4f94fbc](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/4f94fbc7a150131aa852728d764ec1458eae2db1))

## [1.39.5](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.39.4...v1.39.5) (2025-05-21)


### Bug Fixes

* Move business logic to controllers and fix method naming to follow architectural standards ([51b1a4c](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/51b1a4c666469c983393216e68ecc8d60bee17c6))
* update dependencies ([5a3c409](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/5a3c409b406b9a935c47574e446c5531ea157c82))

## [1.39.4](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.39.3...v1.39.4) (2025-05-21)


### Bug Fixes

* update dependencies ([b7b7dc3](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/b7b7dc39c9dcf3799ecafada2bed44462a91076e))

## [1.39.3](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.39.2...v1.39.3) (2025-05-21)


### Bug Fixes

* align search tool implementation with CLI for consistent behavior ([5b81f58](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/5b81f580bb7b04366b645a5db1a7d72043a9c809))
* ensure consistent workspace handling across all Bitbucket tool implementations ([1e78be5](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/1e78be5fdde5ddb13f395cdc655ae4f0ee639555))
* ensure consistent workspace handling and parameter validation across all Bitbucket tools ([70d5cba](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/70d5cba00c5f4ad71be28b1fa83ff03f30bbc50d))
* rename search tool from 'atlassian_search' to 'bb_search' for consistent naming convention ([a3c467c](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/a3c467c696bfe55f3f6ae519352324ced7274960))

## [1.39.2](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.39.1...v1.39.2) (2025-05-20)


### Bug Fixes

* fix linter errors and unused exports in repository clone feature ([c916f53](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/c916f539aa45c6ac903459258dc4f8cc30fba508))
* improve repository clone feature with SSH support and better path handling ([f5955f3](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/f5955f3888ded00136dfc6b76e909e2d2261fbf8))

## [1.39.1](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.39.0...v1.39.1) (2025-05-20)


### Bug Fixes

* update dependencies ([ae112a6](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/ae112a60fdd38f1f35e98fd61992a205efc0517c))

# [1.39.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.38.4...v1.39.0) (2025-05-19)


### Features

* removed backward compatibility flag from diff cli and deprecated sort parameter from workspaces types ([108ef54](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/108ef549c85e7f894191a1e95ccc39319dd3c32f))

## [1.38.4](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.38.3...v1.38.4) (2025-05-19)


### Bug Fixes

* remove unused code for better maintainability ([711f86d](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/711f86d81a8f7e26b856560ffba576cedc671a25))

## [1.38.3](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.38.2...v1.38.3) (2025-05-19)


### Bug Fixes

* refactor repositories controller into separate controllers for better maintainability ([3461d8a](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/3461d8a32c18ba05be483ae7f24758f51e2b8f55))
* refactor search controller into separate controllers by search type ([38a7d35](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/38a7d35bf4dae83846dbaf316555cfb81cc394ab))

## [1.38.2](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.38.1...v1.38.2) (2025-05-19)


### Bug Fixes

* remove unused code and exports to improve maintainability ([e419c07](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/e419c07f43128d334094fba50ff90b2a76bc0229))

## [1.38.1](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.38.0...v1.38.1) (2025-05-19)


### Bug Fixes

* correct code block formatting with tabs for nested code blocks ([2c19c16](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/2c19c161247723fb04611701420d30f93d1e2cac))

# [1.38.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.37.0...v1.38.0) (2025-05-19)


### Features

* update dependencies ([76fd24f](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/76fd24f53d69ccf987bcd3971af51204736f6d16))

# [1.37.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.36.5...v1.37.0) (2025-05-18)


### Features

* Refine ControllerResponse implementation ([dbe160f](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/dbe160f085ec89c6856b822f16be22271c0fce7f))

## [1.36.5](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.36.4...v1.36.5) (2025-05-17)


### Bug Fixes

* remove empty metadata objects from Bitbucket tool responses ([ab65f71](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/ab65f71c4eb62ea6a21323bf821650a1e9252c7a))

## [1.36.4](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.36.3...v1.36.4) (2025-05-17)


### Bug Fixes

* improve documentation and error guidance for counterintuitive branch and commit diff parameter ordering ([ec374e6](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/ec374e6443f383d8552ace999b852d4ecc8458e0))

## [1.36.3](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.36.2...v1.36.3) (2025-05-17)


### Bug Fixes

* improve diff_commits tool to better handle cases with empty diffstat but existing changes ([736304b](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/736304b74b6a0f39644af55a972dde4ec9d9e041))

## [1.36.2](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.36.1...v1.36.2) (2025-05-17)


### Bug Fixes

* improve error handling for invalid PR IDs in Bitbucket pull request tool ([14afe1a](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/14afe1a499f117ad8fd50b75b326e4d8082618fa))

## [1.36.1](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.36.0...v1.36.1) (2025-05-17)


### Bug Fixes

* ensure projectKey is passed from tool to controller for bb_ls_repos ([a0c26db](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/a0c26db744edd1f383014c61aa9c25643035b8a3))

# [1.36.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.35.1...v1.36.0) (2025-05-17)


### Bug Fixes

* Improve tests, refactor, and document includeComments feature ([5d9fbfd](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/5d9fbfd7598218af02abdf439d5b304e325753bd))
* Improve transport utility tests to use real environments ([20b8cf2](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/20b8cf23ef09d42f8556a0f8840ad02f082cc215))


### Features

* Add includeComments option to get-pr command ([ba72020](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/ba72020ea49bc0e58b0f559ead7df4d54563a8fa))
* Enhance get-pr to include comments with flag ([a0dbb89](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/a0dbb89517e1bd7011b80fb8fcf90352214f784e))
* Enhance get-repo to include recent PRs by default ([0052629](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/005262911c975f5dd91c1a871659b86c16a454da))
* Standardize CLI parameter formats across commands ([c267a14](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/c267a147c2d59db5ca7487c87d91fd8a123f39d8))

## [1.35.1](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.35.0...v1.35.1) (2025-05-17)


### Bug Fixes

* Update Bitbucket README for default workspace and diffs ([fe36a20](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/fe36a20c834ecf584673c921b293cac050571046))

# [1.35.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.34.0...v1.35.0) (2025-05-17)


### Features

* make workspaceSlug optional in remaining tools and controllers ([6d2f4d6](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/6d2f4d6860e76cbcd7ff8cde0fd1e70b8377c464))

# [1.34.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.33.0...v1.34.0) (2025-05-17)


### Features

* make workspaceSlug parameter optional with default workspace support ([16e41f5](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/16e41f5c0a37b41078aeb940612f79399c8c4296))

# [1.33.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.32.5...v1.33.0) (2025-05-17)


### Features

* implement core principles of minimal input and rich output by default ([0dc2c0d](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/0dc2c0d2dad7a53f6a6202a67fed0372b80d9968))

## [1.32.5](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.32.4...v1.32.5) (2025-05-16)


### Bug Fixes

* implement getFileContent in atlassian.repositories.controller.ts ([5ebc2fb](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/5ebc2fbb54e1516de2ee9848dbfcddb643cd2512))

## [1.32.4](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.32.3...v1.32.4) (2025-05-16)


### Bug Fixes

* improve documentation and error handling for searching and diffing operations ([2670423](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/267042342b3102d82737aeee588db684e4cf00c5))

## [1.32.3](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.32.2...v1.32.3) (2025-05-16)


### Bug Fixes

* Make repoSlug conditionally required for pullrequests and commits scopes in search tool ([a1adc3a](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/a1adc3af40fec80f4c85dccf3b60c02770d0f306))

## [1.32.2](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.32.1...v1.32.2) (2025-05-16)


### Bug Fixes

* improve filtering in Bitbucket commands for projectKey, language, and scope parameters ([3cb34da](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/3cb34dae514ee2f76449c3f099a86dd3bd0e47af))

## [1.32.1](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.32.0...v1.32.1) (2025-05-16)


### Bug Fixes

* resolve type errors in repository controller stub functions ([4ec45e7](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/4ec45e7e05deadc67b9c5e9f17da276f9302aba6))

# [1.32.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.31.0...v1.32.0) (2025-05-15)


### Features

* improve search, pagination, and filtering features ([167af40](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/167af40154b69868fdab26a7582d140ee658b0cb))

# [1.31.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.30.3...v1.31.0) (2025-05-15)


### Bug Fixes

* resolve duplicate exports in error-handler utilities ([fec7ecb](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/fec7ecb08512467e02a4cc52ef3856adff0c88e6))


### Features

* enhance Bitbucket-specific error handling ([165e566](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/165e566c25c0056bdb498fadf6d543372e41a1d8))
* enhanced error handling for Bitbucket API responses ([a9cf6c0](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/a9cf6c0184e0d50cbf179a77c3e83342b0376de0))
* enhanced error handling for Bitbucket API responses ([08cbf83](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/08cbf83d81b633201cc2873e4461302377ab9be1))
* enhanced error handling for Bitbucket API responses ([91e3354](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/91e3354746e106d3ed3d4ccca16631db00ef2ab4))

## [1.30.3](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.30.2...v1.30.3) (2025-05-15)


### Bug Fixes

* set default topic=false for diff operations and remove topic parameter from CLI/tools ([2300228](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/23002286221b70fede8c5d7986d8236c752b7766))

## [1.30.2](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.30.1...v1.30.2) (2025-05-15)


### Bug Fixes

* apply proper formatting to query handling in listBranches ([169f75b](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/169f75b32bf05feb3551c569d12fdfa7e27f553f))

## [1.30.1](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.30.0...v1.30.1) (2025-05-14)


### Bug Fixes

* remove Dockerfile and smithery.yaml ([42ffad6](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/42ffad6cbb0baf7d0644a580957d7c86d39da561))

# [1.30.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.29.1...v1.30.0) (2025-05-14)


### Features

* enhance error handling with vendor propagation and enriched CLI/Tool formatting ([db16d11](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/db16d1113d6148e5d207cdbc804e6fec4012d5ea))

## [1.29.1](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.29.0...v1.29.1) (2025-05-13)


### Bug Fixes

* route enhanced clone error via createApiError to keep details ([4c03cdb](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/4c03cdbe6e16bd85a78d106b957a33f51057bc80))

# [1.29.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.28.1...v1.29.0) (2025-05-13)


### Features

* enhance clone error handling with user guidance ([3921c1f](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/3921c1f8c1990aa6b70675622f9b747ea551ff96))

## [1.28.1](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.28.0...v1.28.1) (2025-05-13)


### Bug Fixes

* prefer ssh clone to use default ssh keys ([ef5a13f](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/ef5a13f150bc3a2a4a03c0aea2c2a6a5dc910819))

# [1.28.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.27.1...v1.28.0) (2025-05-13)


### Bug Fixes

* use HTTPS clone with embedded credentials to avoid SSH access denied in server mode ([3fa0bad](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/3fa0bad1d8faeafe0659b76340a0b15682a74083))


### Features

* add list branches feature for Bitbucket repositories (CLI, MCP tool, controller, service, formatter) ([e68e8da](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/e68e8da865d0f128b4930ee2c7b40cf799d3fd28))

## [1.27.1](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.27.0...v1.27.1) (2025-05-13)


### Bug Fixes

* update dependencies ([2c74c7a](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/2c74c7aae0e422380d19efb5fdccef823f3590af))

# [1.27.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.26.7...v1.27.0) (2025-05-13)


### Features

* add diff tools for branch and commit comparison ([e201f9e](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/e201f9e6cbe940fc8354eff2224dfe78bc7fa637))

## [1.26.7](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.26.6...v1.26.7) (2025-05-09)


### Bug Fixes

* increase test timeouts for API-dependent tests to improve reliability ([08a4d75](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/08a4d754c819207b96ff91f813599561c313c3e6))

## [1.26.6](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.26.5...v1.26.6) (2025-05-08)


### Bug Fixes

* Remove unused ADF conversion functions from Bitbucket implementation ([1abe807](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/1abe807ec17ad21a06dde3e88ee90d9597f14519))

## [1.26.5](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.26.4...v1.26.5) (2025-05-08)


### Bug Fixes

* Fix bullet list rendering in Bitbucket markdown handling ([c3a4b71](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/c3a4b71d2d6e7c2e077ef3941c6b5bea0f5efb15))
* improve markdown rendering in Bitbucket PR descriptions and comments ([4e73784](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/4e7378425fd71e629b3fc3c6cc67a6d4f69672ce))

## [1.26.4](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.26.3...v1.26.4) (2025-05-07)


### Performance Improvements

* Update dependencies ([37f8849](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/37f884938d94bae4d832c780393f04f061831b56))

## [1.26.3](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.26.2...v1.26.3) (2025-05-07)


### Bug Fixes

* Improve directory validation and error handling for repository cloning ([d6c5c7f](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/d6c5c7f7f7f25be9149084b0ad7e96b0d6ca7ce2))


### Performance Improvements

* Update dependencies ([858dc27](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/858dc274af5a5bda7af4baa5c5c2628ad7aa3b1c))

## [1.26.2](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.26.1...v1.26.2) (2025-05-07)


### Bug Fixes

* Simplify bb_clone_repo documentation for clarity ([97871ba](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/97871ba8b36d6aef6bb90cf5fbd646ce3e394425))

## [1.26.1](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.26.0...v1.26.1) (2025-05-07)


### Bug Fixes

* Add documentation for get-file functionality in README ([542933e](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/542933e9eb14e2bf97e39ad11ad3b70bbd3eb99a))

# [1.26.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.25.1...v1.26.0) (2025-05-07)


### Features

* Add file content retrieval via CLI and Tool ([a8a306e](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/a8a306e154ff2aea30a5161faa7575c499bd82c0))

## [1.25.1](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.25.0...v1.25.1) (2025-05-06)


### Bug Fixes

* Clarify clone tool targetPath and update README ([92e4e53](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/92e4e53322a8e92324b8e7776503e767bcbcf4d1))

# [1.25.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.24.0...v1.25.0) (2025-05-06)


### Features

* Add repository clone functionality via CLI and Tool ([648392f](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/648392f1fdd2e0faa3ce94882a550dca363e861c))

# [1.24.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.23.10...v1.24.0) (2025-05-06)


### Features

* sync ADF utility enhancements from Jira project ([9f0c4be](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/9f0c4bed91262790e71c38201722f6bf76b9ff91))

## [1.23.10](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.23.9...v1.23.10) (2025-05-06)


### Performance Improvements

* Update dependencies ([e22ef5b](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/e22ef5b4af772f4c627c24021ba92d706483a8d3))

## [1.23.9](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.23.8...v1.23.9) (2025-05-06)


### Bug Fixes

* Standardize terminology from create to add across operations ([37b7735](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/37b7735727483756a3d530ad6a651a8f623feaa7))
* Update controller method names to match add pattern and fix test cases ([a10317c](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/a10317c2b1713a7aea91cfb2d73c100f7c7055e6))
* Update controller method references in tools file ([2682de8](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/2682de83a2caa4aa18f94b884d8d473454d9844d))

## [1.23.8](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.23.7...v1.23.8) (2025-05-06)


### Performance Improvements

* Update dependencies ([41ffc7b](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/41ffc7b92f2cf135d2f67a80a5cf65de565633fa))

## [1.23.7](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.23.6...v1.23.7) (2025-05-06)


### Bug Fixes

* Revert back the index.ts and package.json ([57eeb01](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/57eeb01321e7995bae7a4ffa3363feda1f8008ae))

## [1.23.6](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.23.5...v1.23.6) (2025-05-06)


### Bug Fixes

* improve main module detection for npx compatibility ([efe5d4c](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/efe5d4c0ed7c15c9729a4ad7d3c91afcb8925c31))

## [1.23.5](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.23.4...v1.23.5) (2025-05-06)


### Bug Fixes

* improve main module detection for npx compatibility ([90f0f26](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/90f0f2685bc8fe95e162e2e1fdae7ac7afbb5d76))

## [1.23.4](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.23.3...v1.23.4) (2025-05-05)


### Bug Fixes

* revert to working server version that stays running ([a80eef9](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/a80eef963c9a4de38110112261a772e1fb33385b))

## [1.23.3](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.23.2...v1.23.3) (2025-05-05)


### Bug Fixes

* improve signal handling for npx support ([a4a361c](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/a4a361ca3fd2983446880eacabb5fa979f1336d1))

## [1.23.2](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.23.1...v1.23.2) (2025-05-05)


### Bug Fixes

* Remove explicit exit after CLI execution in index.ts ([9b0bed0](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/9b0bed07040cb54516fff6e9f0c8cc667ccd5786))

## [1.23.1](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.23.0...v1.23.1) (2025-05-05)


### Bug Fixes

* Apply cross-platform compatibility improvements from boilerplate ([3426b97](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/3426b97d62cfef5076436600be3126c7a0cf4382))

# [1.23.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.22.0...v1.23.0) (2025-05-05)


### Features

* Add --project-key filter to ls-repos command ([f07c044](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/f07c0441a4757da5cdd659602ef3e72d6fc38776))
* Add create-branch command ([4cc5bdb](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/4cc5bdb921e9d1e12c7b7689e3719d4f1c429821))
* Display comment and task counts in get-pr output ([a1513ef](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/a1513efefd0992510a0e8e08e75db487ce87bf60))
* Display main branch name in get-repo output ([12cc91e](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/12cc91ea89a241002ddfef4523633ddb90f79c2e))
* Improve search command usability ([c5d1550](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/c5d155053a4ea6889f86e6861925b25c7b979727))

# [1.22.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.21.7...v1.22.0) (2025-05-05)


### Features

* Display code snippets for inline PR comments ([5a8024b](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/5a8024b3cd259fa6ff9804a717149d3933244cc2))

## [1.21.7](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.21.6...v1.21.7) (2025-05-05)


### Bug Fixes

* Indicate deleted PR comments in output ([f6069c7](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/f6069c79c38b8eb1e69b4c6531d5c3eb78c1bdfb))

## [1.21.6](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.21.5...v1.21.6) (2025-05-05)


### Bug Fixes

* Include PR ID in ls-pr-comments title ([f73c9da](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/f73c9dacc50ee2a9450b4ca1bb73a79f29ca3f5c))


### Performance Improvements

* Update dependencies ([7166012](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/7166012b406d435eea7dec7a0d80d7ed5a17727b))

## [1.21.5](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.21.4...v1.21.5) (2025-05-05)


### Bug Fixes

* Remove commented-out code and unused exports ([d81ad82](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/d81ad8239c4f0975aa995dad775038a9fb1ae87d))

## [1.21.4](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.21.3...v1.21.4) (2025-05-05)


### Bug Fixes

* apply role filter in list repositories API call ([6ca7e4b](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/6ca7e4b29015aa689fd86d681ff28b0eabf52a09))

## [1.21.3](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.21.2...v1.21.3) (2025-05-04)


### Performance Improvements

* Update dependencies ([32bd5ae](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/32bd5aedf2368d4a1a42ee8709621042586416f8))

## [1.21.2](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.21.1...v1.21.2) (2025-05-04)


### Bug Fixes

* **search:** Correct query formatting for ls-prs and search scopes ([31d6def](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/31d6def83c27bc1da3d98cbbf94ff16f41161d69))

## [1.21.1](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.21.0...v1.21.1) (2025-05-04)


### Bug Fixes

* refine tool definitions and parameter naming ([1efb27e](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/1efb27e51c5b13ed4e548098a8600674f2034fd7))

# [1.21.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.20.4...v1.21.0) (2025-05-04)


### Features

* **format:** standardize CLI and Tool output formatting ([2ad3f05](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/2ad3f05e08848271975695bfab7c9bd97a0d2ff0))

## [1.20.4](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.20.3...v1.20.4) (2025-05-04)


### Bug Fixes

* update pagination handling in search formatter ([ec8f6ce](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/ec8f6ce21660c4e338bc16278fee393c131bc7eb))

## [1.20.3](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.20.2...v1.20.3) (2025-05-04)


### Bug Fixes

* **bitbucket:** implement Zod validation and align types ([7611404](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/761140440996878f0170c2e453def84d73f9af94))

## [1.20.2](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.20.1...v1.20.2) (2025-05-04)


### Bug Fixes

* Clean up unused exports and types in Bitbucket server ([3d469fc](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/3d469fcc2752f8a7eb817d60b04e164901665e3b))
* Remove re-exports from index.ts ([5ab1bf6](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/5ab1bf60d5f8c7e9b572edb093d7e071972fd222))

## [1.20.1](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.20.0...v1.20.1) (2025-05-02)


### Bug Fixes

* trigger release ([ae058d8](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/ae058d8eeb50f811c3c9afe7d0bfa38b16b696b1))

# [1.20.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.19.3...v1.20.0) (2025-05-02)


### Features

* Standardize pagination output in tool content text ([f072ae7](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/f072ae74a3ca9bfaecf6eb32ddc01cd35d25718a))

## [1.19.3](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.19.2...v1.19.3) (2025-05-02)


### Bug Fixes

* **bitbucket:** correct repository list formatting and remove redundant title in search ([ac6ce2a](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/ac6ce2a641751669ab1e345917059febb2b6bbf5))

## [1.19.2](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.19.1...v1.19.2) (2025-05-02)


### Bug Fixes

* **bitbucket:** correct repository list formatting and remove redundant title in search ([e32071f](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/e32071f223e83305de6c1056a97f26e9b352ca3a))

## [1.19.1](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.19.0...v1.19.1) (2025-05-02)


### Bug Fixes

* **bitbucket:** improve formatting for bb_search code results ([5469e37](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/5469e3734aa02a532668c36468287ecc8a3760b8))

# [1.19.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.18.0...v1.19.0) (2025-05-02)


### Features

* **bitbucket:** add --full-diff option to bb_get_pr tool ([3039fae](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/3039faec68ca605898872e87bedec05cc5b1e920))


### Performance Improvements

* Update dependencies ([77dcad9](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/77dcad9050c7cd4001af2029bc58d781c1b4d3fe))

# [1.18.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.17.3...v1.18.0) (2025-05-01)


### Bug Fixes

* correct option flag format for get-commit-history command ([c97ad6f](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/c97ad6f25675d19eea953db08c49daad3a84ada6))
* remove unused configuration objects to reduce dead code ([f51dc65](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/f51dc6502282c38fd54a8ec6f885f34165c1aa97))
* remove unused formatRelativeTime function for cleaner codebase ([6663157](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/666315765dce68e2ff4cb41c5a9e61580e8504ba))


### Features

* add commit history tool and cli command ([811c155](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/811c1559c1b7a7fbb32fa45a37cbebebc3b225f6))


### Performance Improvements

* streamline Bitbucket tool descriptions for better AI consumption ([1136c3f](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/1136c3f5f91dda81c34fde0c63e261c670b938cc))

## [1.17.3](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.17.2...v1.17.3) (2025-05-01)


### Bug Fixes

* standardize on 'create' verb for PR comments ([d3443ea](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/d3443eac077fb2a93c77fc41df478a37c04d8709))
* Standardize on 'create' verb for PR comments ([cdcfb66](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/cdcfb663db8fb86d4c1f463114f697b77ffb7519))

## [1.17.2](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.17.1...v1.17.2) (2025-04-30)


### Bug Fixes

* **cli:** Align command names and descriptions with tool definitions ([d474994](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/d474994c1f4b0358a53ac9557be4bd7a306247a8))

## [1.17.1](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.17.0...v1.17.1) (2025-04-30)


### Performance Improvements

* Update dependencies ([062b651](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/062b651830b0850cf627323fdf9b9606fc4673c2))

# [1.17.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.16.0...v1.17.0) (2025-04-30)


### Bug Fixes

* Standardize and shorten MCP tool names ([3c66a60](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/3c66a6000be1033c657a52de37ca4c369664b23a))


### Features

* Support multiple keys for global config lookup ([7df9c41](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/7df9c414e4719d547113eec58cf38f4b67bf268e))

# [1.16.0](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.15.3...v1.16.0) (2025-04-25)


### Bug Fixes

* unify tool names and descriptions for consistency ([075d996](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/075d9966cddad3101b5a1ea2331cffd44563d644))


### Features

* prefix Bitbucket tool names with 'bitbucket_' for uniqueness ([69d59a8](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/69d59a80f9a3ef08c649136cd771fbfd8181337b))

## [1.15.3](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.15.2...v1.15.3) (2025-04-22)


### Performance Improvements

* Update dependencies ([fae420e](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/fae420ee00d9dd5c71dfce18610e33e8d8857403))

## [1.15.2](https://github.com/aashari/mcp-server-atlassian-bitbucket/compare/v1.15.1...v1.15.2) (2025-04-20)


### Bug Fixes

* Update dependencies and fix related type errors ([4acea85](https://github.com/aashari/mcp-server-atlassian-bitbucket/commit/4acea85c681dce9af6f23f751384c4aae08480b7))

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
