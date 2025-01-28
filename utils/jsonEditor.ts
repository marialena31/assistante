type FlattenedField = {
  path: string[];
  value: any;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  isArray: boolean;
};

export function flattenJSON(obj: any, parentPath: string[] = []): FlattenedField[] {
  let fields: FlattenedField[] = [];

  for (const key in obj) {
    const value = obj[key];
    const currentPath = [...parentPath, key];
    
    if (Array.isArray(value)) {
      fields.push({
        path: currentPath,
        value: JSON.stringify(value),
        type: 'array',
        isArray: true
      });
    } else if (typeof value === 'object' && value !== null) {
      fields = fields.concat(flattenJSON(value, currentPath));
    } else {
      fields.push({
        path: currentPath,
        value: value,
        type: typeof value as 'string' | 'number' | 'boolean',
        isArray: false
      });
    }
  }

  return fields;
}

export function rebuildJSON(fields: FlattenedField[]): any {
  const result = {};

  fields.forEach(field => {
    type CurrentType = {
      [key: string]: any;
    };

    let current: CurrentType = result;
    const lastIndex = field.path.length - 1;

    field.path.forEach((key, index) => {
      if (index === lastIndex) {
        // Handle the value based on its type
        if (field.isArray) {
          try {
            current[key] = JSON.parse(field.value);
          } catch (e) {
            console.error('Error parsing array:', e);
            current[key] = [];
          }
        } else if (field.type === 'number') {
          current[key] = Number(field.value);
        } else if (field.type === 'boolean') {
          current[key] = Boolean(field.value);
        } else {
          current[key] = field.value;
        }
      } else {
        current[key] = current[key] || {};
        current = current[key];
      }
    });
  });

  return result;
}

export function formatFieldName(path: string[]): string {
  return path
    .map(segment => segment
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
    )
    .join(' › '); // Join with arrow for hierarchy
}
