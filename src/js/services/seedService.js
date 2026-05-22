const RESTAURANTS_KEY = "restaurants";
const RESTAURANTS_SEED_URL = new URL("../../data/restaurants.json", import.meta.url);
const PRESENTATION_DEMO_SEED_URL = new URL("../../data/presentation_demo_seed.json", import.meta.url);
const PRESENTATION_DEMO_KEYS = [
  "users",
  "restaurants",
  "reservations",
  "reviews",
  "notifications"
];

await seedRestaurants();
await seedPresentationDemo();

/**
 * Loads local restaurant seed data when the app has no restaurants yet.
 *
 * @returns {Promise<void>} Resolves after the seed check finishes.
 */
async function seedRestaurants() {
  const storedRestaurants = JSON.parse(localStorage.getItem(RESTAURANTS_KEY) || "[]");

  if (storedRestaurants.length) {
    return;
  }

  try {
    const response = await fetch(RESTAURANTS_SEED_URL);

    if (!response.ok) {
      throw new Error(`Seed request failed with status ${response.status}.`);
    }

    const restaurants = await response.json();
    localStorage.setItem(RESTAURANTS_KEY, JSON.stringify(restaurants));
  } catch (error) {
    console.warn("Unable to load local restaurant seed data.", error);
  }
}

/**
 * Loads presentation demo data without overwriting existing local records.
 *
 * @returns {Promise<void>} Resolves after the demo seed check finishes.
 */
async function seedPresentationDemo() {
  try {
    const response = await fetch(PRESENTATION_DEMO_SEED_URL);

    if (!response.ok) {
      throw new Error(`Presentation seed request failed with status ${response.status}.`);
    }

    const seed = await response.json();
    const demoData = seed.localStorage || {};

    PRESENTATION_DEMO_KEYS.forEach((key) => {
      const storedItems = JSON.parse(localStorage.getItem(key) || "[]");
      const demoItems = demoData[key] || [];
      const mergedItems = mergeById(storedItems, demoItems);

      localStorage.setItem(key, JSON.stringify(mergedItems));
    });
  } catch (error) {
    console.warn("Unable to load presentation demo seed data.", error);
  }
}

/**
 * Appends missing seed items using the record id as the stable identifier.
 *
 * @param {Array<Object>} storedItems - Existing items from localStorage.
 * @param {Array<Object>} seedItems - Items loaded from the seed file.
 * @returns {Array<Object>} Existing items plus missing seed items.
 */
function mergeById(storedItems, seedItems) {
  const uniqueStoredItems = removeDuplicatedById(storedItems);
  const storedIds = new Set(uniqueStoredItems.map((item) => String(item.id)));
  const missingItems = seedItems.filter((item) => !storedIds.has(String(item.id)));

  return [...uniqueStoredItems, ...missingItems];
}

/**
 * Removes duplicated records already persisted in localStorage.
 *
 * @param {Array<Object>} items - Items loaded from localStorage.
 * @returns {Array<Object>} Items without repeated ids.
 */
function removeDuplicatedById(items) {
  const seenIds = new Set();

  return items.filter((item) => {
    const itemId = String(item.id);

    if (seenIds.has(itemId)) {
      return false;
    }

    seenIds.add(itemId);
    return true;
  });
}
