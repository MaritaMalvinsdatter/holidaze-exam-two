
export function load(key) {
  try {
    const value = localStorage.getItem(key);
    if (key === 'token' || key === 'profile') {
        return value;
    }
    return JSON.parse(value);
  } catch (error) {
    console.error("Loading failed:", error);
  }
}

export function save(key, value) {
  if (key === 'token') {
      localStorage.setItem(key, value);
  } else {
      localStorage.setItem(key, JSON.stringify(value));
  }
}
  
  export function remove(key) {
    localStorage.removeItem(key);
  }
  