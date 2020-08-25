const fs = require('fs-extra');
const stablestringify = require('fast-json-stable-stringify');

// WARNING: not supporting collections or organizations

async function main() {
  const input = await fs.readFile(process.stdin.fd, 'utf-8');
  const exportedvault = JSON.parse(input);

  // Make unique folders, keep ids
  const folders = {};
  const foldersidx = {};
  for(let folder of exportedvault.folders) {
    foldersidx[folder.id] = folder;

    if(folders[folder.name]) continue;
    folders[folder.name] = folder;
  }

  // Make unique items
  const items = {};
  for(let item of exportedvault.items) {
    // Make comparable object
    const { id, organizationId, folderId, collectionIds, ...props } = item;
    if(collectionIds) throw new Error('collections not supported');
    if(organizationId) throw new Error('organizations not supported');
    if(folderId) {
      props['_foldername'] = foldersidx[folderId].name;
    }

    // Save if first time
    const stable = stablestringify(props);
    if(items[stable]) continue;
    items[stable] = Object.assign({ id }, props);
  }

  // Remap unique items to folders
  const dedupeditems = Object.values(items).map(item => {
    const { _foldername, ...props } = item;
    const newprops = {
      organizationId: null,
      folderId: (_foldername ? folders[_foldername].id : null),
      collectionIds: null,
    }

    return { ...props, ...newprops }
  });

  // Dump to output
  const result = {
    folders: Object.entries(folders).map(e => e[1]),
    items: dedupeditems,
  }
  console.log(JSON.stringify(result, null, 2));
  console.error(`Deduped ${exportedvault.items.length}->${result.items.length} items and ${exportedvault.folders.length}->${result.folders.length} folders`)
}
main();
