const KEY = "tables";

export function getTables() {
  return JSON.parse(localStorage.getItem(KEY)) || [];
}

export function saveTable(table) {
  const tables = getTables();
  tables.push(table);
  localStorage.setItem(KEY, JSON.stringify(tables));
}

export function deleteTable(id) {
  const tables = getTables().filter(table => table.id !== id);
  localStorage.setItem(KEY, JSON.stringify(tables));
}