Simple tool for de-duplicating bitwarden export files for accounts that don't use organizations or shared collections.

I needed it because some clients failed to sync and vault.bitwarden.com import does not deduplicate items or folders.

## Usage

1.  Create an export with duplicates
2.  Create a de-duplicated file using `cat export.json | node dedupe.js > deduped.json`
3.  Remove all items and folders using mass-select in vault.bitwarden.com
4.  Sync all your clients
5.  Import deduped.json in https://vault.bitwarden.com/#/tools/import
6.  Sync all your clients