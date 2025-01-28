import { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

type FieldType = 'string' | 'number' | 'boolean' | 'array' | 'object';

type Field = {
  path: string[];
  value: any;
  type: FieldType;
  isArray: boolean;
  originalName?: string;
  deleted?: boolean;
  id?: string; // Added for drag and drop
};

type Section = {
  name: string;
  fields: Field[];
  path: string[];
};

type HistoryEntry = {
  timestamp: number;
  content: string;
  description: string;
};

function isObject(value: any): boolean {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function flattenJSON(obj: any, parentPath: string[] = []): Field[] {
  let fields: Field[] = [];

  for (const key in obj) {
    const value = obj[key];
    const currentPath = [...parentPath, key];

    if (Array.isArray(value)) {
      // Special handling for known array fields that should be expanded
      const shouldExpandArray = [
        'services', 'features', 'benefits', 'requirements',
        'skills', 'tools', 'technologies', 'advantages'
      ].includes(key);

      if (shouldExpandArray) {
        // Create individual fields for each array item
        value.forEach((item, index) => {
          fields.push({
            path: [...currentPath, index.toString()],
            value: item,
            type: typeof item as FieldType,
            isArray: false
          });
        });
      } else if (value.length > 0 && isObject(value[0])) {
        // Handle array of objects
        value.forEach((item, index) => {
          fields = fields.concat(flattenJSON(item, [...currentPath, index.toString()]));
        });
      } else {
        // Handle simple arrays that shouldn't be expanded
        fields.push({
          path: currentPath,
          value: JSON.stringify(value),
          type: 'array',
          isArray: true
        });
      }
    } else if (isObject(value)) {
      fields = fields.concat(flattenJSON(value, currentPath));
    } else {
      fields.push({
        path: currentPath,
        value: value,
        type: typeof value as FieldType,
        isArray: false
      });
    }
  }

  return fields;
}

function groupFieldsIntoSections(fields: Field[]): Section[] {
  const sections: Section[] = [];
  const fieldsBySection = new Map<string, Field[]>();

  fields.forEach(field => {
    const sectionPath = field.path.slice(0, -1);
    const sectionKey = sectionPath.join('.');
    
    if (!fieldsBySection.has(sectionKey)) {
      fieldsBySection.set(sectionKey, []);
    }
    fieldsBySection.get(sectionKey)?.push(field);
  });

  fieldsBySection.forEach((fields, key) => {
    const path = key ? key.split('.') : [];
    sections.push({
      name: formatSectionName(path),
      fields,
      path
    });
  });

  return sections.sort((a, b) => a.path.length - b.path.length);
}

function formatSectionName(path: string[]): string {
  if (path.length === 0) return 'Général';
  
  // Special cases for known section names
  const lastSegment = path[path.length - 1];
  if (lastSegment === 'sectorPackages') return 'Forfaits par Secteur';
  if (lastSegment === 'sectors') return 'Secteurs d\'activité';
  if (lastSegment === 'packages') return 'Forfaits';
  if (lastSegment === 'features') return 'Caractéristiques';
  if (lastSegment === 'services') return 'Services';
  if (lastSegment === 'benefits') return 'Avantages';
  if (lastSegment === 'requirements') return 'Prérequis';
  if (lastSegment === 'skills') return 'Compétences';
  if (lastSegment === 'tools') return 'Outils';
  if (lastSegment === 'technologies') return 'Technologies';
  if (lastSegment === 'advantages') return 'Points Forts';
  if (lastSegment === 'subscriptions') return 'Abonnements';
  
  return path
    .map(segment => {
      // Check if the segment is a number (array index)
      if (/^\d+$/.test(segment)) {
        const parentSegment = path[path.length - 2];
        if (parentSegment === 'sectors') return `Secteur ${parseInt(segment) + 1}`;
        if (parentSegment === 'packages') return `Forfait ${parseInt(segment) + 1}`;
        if (parentSegment === 'subscriptions') return `Abonnement ${parseInt(segment) + 1}`;
        if (parentSegment === 'services') return `Service ${parseInt(segment) + 1}`;
        if (parentSegment === 'features') return `Caractéristique ${parseInt(segment) + 1}`;
        if (parentSegment === 'benefits') return `Avantage ${parseInt(segment) + 1}`;
        if (parentSegment === 'requirements') return `Prérequis ${parseInt(segment) + 1}`;
        if (parentSegment === 'skills') return `Compétence ${parseInt(segment) + 1}`;
        if (parentSegment === 'tools') return `Outil ${parseInt(segment) + 1}`;
        if (parentSegment === 'technologies') return `Technologie ${parseInt(segment) + 1}`;
        if (parentSegment === 'advantages') return `Point Fort ${parseInt(segment) + 1}`;
        return `Item ${parseInt(segment) + 1}`;
      }
      return segment
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
    })
    .join(' › ');
}

function getFieldContext(path: string[]): string {
  // Get the context of where this field appears
  const context = path.slice(0, -1).map((segment, index) => {
    if (/^\d+$/.test(segment)) {
      const parentSegment = path[index - 1];
      switch (parentSegment) {
        case 'sectors': return `Secteur ${parseInt(segment) + 1}`;
        case 'packages': return `Forfait ${parseInt(segment) + 1}`;
        case 'features': return `Caractéristique ${parseInt(segment) + 1}`;
        case 'services': return `Service ${parseInt(segment) + 1}`;
        case 'benefits': return `Avantage ${parseInt(segment) + 1}`;
        case 'requirements': return `Prérequis ${parseInt(segment) + 1}`;
        case 'skills': return `Compétence ${parseInt(segment) + 1}`;
        case 'tools': return `Outil ${parseInt(segment) + 1}`;
        case 'technologies': return `Technologie ${parseInt(segment) + 1}`;
        case 'advantages': return `Point Fort ${parseInt(segment) + 1}`;
        default: return `Item ${parseInt(segment) + 1}`;
      }
    }
    return formatSectionName([segment]);
  });
  return context.join(' › ');
}

function formatFieldName(path: string[], showContext: boolean = false): string {
  const fieldName = path[path.length - 1];
  let displayName = '';
  
  // Special cases for known field names
  switch (fieldName) {
    case 'title': displayName = 'Titre'; break;
    case 'subtitle': displayName = 'Sous-titre'; break;
    case 'description': displayName = 'Description'; break;
    case 'name': displayName = 'Nom'; break;
    case 'price': displayName = 'Prix'; break;
    case 'unit': displayName = 'Unité'; break;
    case 'icon': displayName = 'Icône'; break;
    case 'popular': displayName = 'Populaire'; break;
    default:
      displayName = fieldName
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
  }

  if (showContext && path.length > 1) {
    const context = getFieldContext(path);
    return context ? `${displayName} (${context})` : displayName;
  }

  return displayName;
}

function renameFieldInJSON(json: any, oldPath: string[], newName: string): any {
  if (oldPath.length === 1) {
    const { [oldPath[0]]: value, ...rest } = json;
    return { ...rest, [newName]: value };
  }

  const result = { ...json };
  let current = result;
  
  // Navigate to the parent object
  for (let i = 0; i < oldPath.length - 1; i++) {
    const key = oldPath[i];
    if (Array.isArray(current[key])) {
      const index = parseInt(oldPath[i + 1]);
      if (!isNaN(index)) {
        current = current[key][index];
        i++; // Skip the next index since we've handled it
      } else {
        current = current[key];
      }
    } else {
      current = current[key];
    }
  }

  // Rename the field
  const oldName = oldPath[oldPath.length - 1];
  const { [oldName]: value, ...rest } = current;
  current = Object.assign(current, { ...rest, [newName]: value });

  return result;
}

function rebuildJSON(fields: Field[]): any {
  type ResultType = { [key: string]: any }; 
  let result: ResultType = {}; 
  let current: ResultType = result; 
  
  const arrayPaths: Set<string> = new Set();
  
  // First pass: identify array paths
  fields.forEach(field => {
    const path = field.path.slice(0, -1);
    if (/^\d+$/.test(field.path[field.path.length - 2])) {
      arrayPaths.add(path.slice(0, -1).join('.'));
    }
  });

  // Second pass: build the object
  fields.forEach(field => {
    current = result; 
    const lastIndex = field.path.length - 1;
    
    for (let i = 0; i < lastIndex; i++) {
      const key = field.path[i];
      const nextKey = field.path[i + 1];
      const isNextKeyNumeric = /^\d+$/.test(nextKey);
      
      if (isNextKeyNumeric) {
        current[key] = current[key] || [];
      } else {
        current[key] = current[key] || {};
      }
      current = current[key];
    }
    
    const lastKey = field.path[lastIndex];
    if (field.isArray) {
      try {
        current[lastKey] = JSON.parse(field.value);
      } catch (e) {
        console.error('Error parsing array:', e);
        current[lastKey] = [];
      }
    } else {
      if (field.type === 'number') {
        current[lastKey] = Number(field.value);
      } else if (field.type === 'boolean') {
        current[lastKey] = field.value === 'true';
      } else {
        current[lastKey] = field.value;
      }
    }
  });

  // Third pass: convert numeric objects to arrays
  arrayPaths.forEach(path => {
    let current = result;
    const parts = path.split('.');
    
    // Navigate to the array container
    for (const part of parts) {
      current = current[part];
    }

    if (isObject(current)) {
      const keys = Object.keys(current).sort((a, b) => parseInt(a) - parseInt(b));
      const array = keys.map(key => current[key]);
      
      // Replace the object with the array in the result
      let target = result;
      for (let i = 0; i < parts.length - 1; i++) {
        target = target[parts[i]];
      }
      target[parts[parts.length - 1]] = array;
    }
  });

  return result;
}

type DynamicFormProps = {
  content: string;
  onSave: (content: string) => void;
  loading?: boolean;
};

export default function DynamicForm({ content, onSave, loading }: DynamicFormProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [newFieldName, setNewFieldName] = useState<string>('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [addingField, setAddingField] = useState<{ sectionPath: string; fieldName: string; fieldType: FieldType } | null>(null);

  useEffect(() => {
    try {
      // Parse the content if it's a string
      const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
      
      // Flatten the JSON into fields
      const fields = flattenJSON(parsedContent);
      
      // Add unique IDs to fields for drag and drop
      fields.forEach((field, index) => {
        field.id = field.path.join('.') + '-' + index;
      });
      
      // Group fields into sections
      const groupedSections = groupFieldsIntoSections(fields);
      
      // Update the sections state
      setSections(groupedSections);
      
      // Clear any previous errors
      setError(null);
    } catch (e) {
      console.error('Error initializing form:', e);
      setError('Erreur lors de l\'initialisation du formulaire');
    }
  }, [content]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sectionId = source.droppableId.split('-')[0];
    const section = sections.find(s => s.path.join('.') === sectionId);

    if (!section) return;

    const newSections = [...sections];
    const sectionIndex = sections.findIndex(s => s.path.join('.') === sectionId);

    // Remove field from source
    const [movedField] = section.fields.splice(source.index, 1);

    // Add field to destination
    section.fields.splice(destination.index, 0, movedField);

    // Update sections
    newSections[sectionIndex] = section;
    setSections(newSections);

    // Update the JSON and save
    const updatedJSON = rebuildJSON(newSections.flatMap(section => section.fields));
    onSave(JSON.stringify(updatedJSON, null, 2));
  };

  const addToHistory = (newContent: string, description: string) => {
    setHistory(prev => {
      const newHistory = [...prev, {
        timestamp: Date.now(),
        content: newContent,
        description
      }];
      // Keep last 10 changes
      return newHistory.slice(-10);
    });
  };

  const handleRollback = (entry: HistoryEntry) => {
    try {
      const parsedContent = JSON.parse(entry.content);
      const fields = flattenJSON(parsedContent);
      const groupedSections = groupFieldsIntoSections(fields);
      setSections(groupedSections);
      onSave(entry.content);
      setError(null);
    } catch (e) {
      setError('Erreur lors du rollback');
      console.error('Error during rollback:', e);
    }
  };

  const handleDeleteField = (field: Field) => {
    try {
      const currentJSON = JSON.parse(content);
      let current = currentJSON;
      const path = [...field.path];
      const lastKey = path.pop()!;
      
      // Navigate to the parent object
      for (const key of path) {
        if (current[key] === undefined) return;
        current = current[key];
      }
      
      // Delete the field
      if (Array.isArray(current)) {
        current.splice(parseInt(lastKey), 1);
      } else {
        delete current[lastKey];
      }
      
      const newContent = JSON.stringify(currentJSON, null, 2);
      onSave(newContent);
      addToHistory(newContent, `Deleted field ${field.path.join('.')}`);
      
      // Update form state
      const fields = flattenJSON(currentJSON);
      const groupedSections = groupFieldsIntoSections(fields);
      setSections(groupedSections);
    } catch (e) {
      setError('Erreur lors de la suppression du champ');
      console.error('Error deleting field:', e);
    }
  };

  const handleAddField = (sectionPath: string[], fieldName: string, fieldType: FieldType) => {
    try {
      const currentJSON = JSON.parse(content);
      let current = currentJSON;
      
      // Navigate to the target section
      for (const key of sectionPath) {
        if (current[key] === undefined) {
          current[key] = {};
        }
        current = current[key];
      }
      
      // Add the new field with default value based on type
      const defaultValues: Record<FieldType, any> = {
        string: '',
        number: 0,
        boolean: false,
        array: [],
        object: {}
      };
      
      current[fieldName] = defaultValues[fieldType];
      
      const newContent = JSON.stringify(currentJSON, null, 2);
      onSave(newContent);
      addToHistory(newContent, `Added new field ${[...sectionPath, fieldName].join('.')}`);
      
      // Update form state
      const fields = flattenJSON(currentJSON);
      const groupedSections = groupFieldsIntoSections(fields);
      setSections(groupedSections);
      setAddingField(null);
    } catch (e) {
      setError('Erreur lors de l\'ajout du champ');
      console.error('Error adding field:', e);
    }
  };

  const handleFieldChange = (field: Field, value: string) => {
    const updatedSections = sections.map(section => ({
      ...section,
      fields: section.fields.map(f => 
        f.path.join('.') === field.path.join('.') 
          ? { ...f, value }
          : f
      )
    }));
    setSections(updatedSections);
  };

  const toggleSection = (sectionPath: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionPath)) {
      newExpanded.delete(sectionPath);
    } else {
      newExpanded.add(sectionPath);
    }
    setExpandedSections(newExpanded);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const allFields = sections.flatMap(section => section.fields);
      const rebuiltJSON = rebuildJSON(allFields);
      const jsonString = JSON.stringify(rebuiltJSON, null, 2);
      
      // Save the changes
      onSave(jsonString);
      setError(null);
    } catch (e) {
      setError('Erreur lors de la sauvegarde');
      console.error('Error saving:', e);
    }
  };

  const handleFieldRename = (field: Field, newName: string) => {
    try {
      // Parse current content
      const currentJSON = JSON.parse(content);
      
      // Rename the field in the JSON
      const updatedJSON = renameFieldInJSON(currentJSON, field.path, newName);
      
      // Update the form with new JSON
      const fields = flattenJSON(updatedJSON);
      const groupedSections = groupFieldsIntoSections(fields);
      setSections(groupedSections);
      
      // Save the changes immediately
      onSave(JSON.stringify(updatedJSON, null, 2));
      
      // Reset editing state
      setEditingField(null);
      setNewFieldName('');
      setError(null);
    } catch (e) {
      setError('Erreur lors du renommage du champ');
      console.error('Error renaming field:', e);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const renderField = (field: Field) => {
    const isEditing = editingField === field.path.join('.');
    
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            {formatFieldName(field.path, true)}
          </label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => {
                if (isEditing) {
                  if (newFieldName && newFieldName !== field.path[field.path.length - 1]) {
                    handleFieldRename(field, newFieldName);
                  }
                  setEditingField(null);
                  setNewFieldName('');
                } else {
                  setEditingField(field.path.join('.'));
                  setNewFieldName(field.path[field.path.length - 1]);
                }
              }}
              className="text-xs px-2 py-1 bg-blue-500 text-white hover:bg-blue-600 rounded"
            >
              {isEditing ? 'Sauvegarder' : 'Renommer'}
            </button>
            <button
              type="button"
              onClick={() => handleDeleteField(field)}
              className="text-xs px-2 py-1 bg-red-500 text-white hover:bg-red-600 rounded"
            >
              Supprimer
            </button>
          </div>
        </div>
        
        {isEditing ? (
          <input
            type="text"
            value={newFieldName}
            onChange={(e) => setNewFieldName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Nouveau nom du champ"
          />
        ) : field.type === 'boolean' ? (
          <select
            value={field.value.toString()}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          >
            <option value="true">Oui</option>
            <option value="false">Non</option>
          </select>
        ) : (
          <input
            type={field.type === 'number' ? 'number' : 'text'}
            value={field.value}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        )}
      </div>
    );
  };

  return (
    <DragDropContext 
      onDragEnd={(result) => {
        // Allow modal to close again
        const modal = document.querySelector('[role="dialog"]');
        if (modal) {
          modal.removeAttribute('data-dragging');
        }
        handleDragEnd(result);
      }}
      onBeforeDragStart={() => {
        // Prevent modal from closing during drag
        const modal = document.querySelector('[role="dialog"]');
        if (modal) {
          modal.setAttribute('data-dragging', 'true');
        }
      }}
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="flex-1 space-y-6">
          {sections.map((section) => (
            <div key={section.path.join('.')} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => toggleSection(section.path.join('.'))}
                >
                  {expandedSections.has(section.path.join('.')) ? (
                    <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                  )}
                  <h3 className="text-lg font-medium ml-2">{section.name}</h3>
                </div>
                
                <button
                  type="button"
                  onClick={() => setAddingField({ 
                    sectionPath: section.path.join('.'), 
                    fieldName: '', 
                    fieldType: 'string' 
                  })}
                  className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Ajouter un champ
                </button>
              </div>
              
              {expandedSections.has(section.path.join('.')) && (
                <Droppable 
                  droppableId={`${section.path.join('.')}-droppable`}
                  type="field"
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-4 ml-6 ${snapshot.isDraggingOver ? 'bg-gray-50' : ''}`}
                    >
                      {section.fields.map((field, index) => (
                        <Draggable
                          key={field.id || field.path.join('.')}
                          draggableId={field.id || field.path.join('.')}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`space-y-2 p-3 rounded-lg border ${
                                snapshot.isDragging ? 'bg-gray-50 shadow-lg' : 'bg-white'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <div
                                    {...provided.dragHandleProps}
                                    className="cursor-move text-gray-400 hover:text-gray-600"
                                  >
                                    ⋮⋮
                                  </div>
                                  <label className="block text-sm font-medium text-gray-700">
                                    {formatFieldName(field.path, true)}
                                  </label>
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (editingField === field.path.join('.')) {
                                        if (newFieldName && newFieldName !== field.path[field.path.length - 1]) {
                                          handleFieldRename(field, newFieldName);
                                        }
                                        setEditingField(null);
                                        setNewFieldName('');
                                      } else {
                                        setEditingField(field.path.join('.'));
                                        setNewFieldName(field.path[field.path.length - 1]);
                                      }
                                    }}
                                    className="text-xs px-2 py-1 bg-blue-500 text-white hover:bg-blue-600 rounded"
                                  >
                                    {editingField === field.path.join('.') ? 'Sauvegarder' : 'Renommer'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteField(field)}
                                    className="text-xs px-2 py-1 bg-red-500 text-white hover:bg-red-600 rounded"
                                  >
                                    Supprimer
                                  </button>
                                </div>
                              </div>
                              
                              {editingField === field.path.join('.') ? (
                                <input
                                  type="text"
                                  value={newFieldName}
                                  onChange={(e) => setNewFieldName(e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                  placeholder="Nouveau nom du champ"
                                />
                              ) : field.type === 'boolean' ? (
                                <select
                                  value={field.value.toString()}
                                  onChange={(e) => handleFieldChange(field, e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                >
                                  <option value="true">Oui</option>
                                  <option value="false">Non</option>
                                </select>
                              ) : (
                                <input
                                  type={field.type === 'number' ? 'number' : 'text'}
                                  value={field.value}
                                  onChange={(e) => handleFieldChange(field, e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                />
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              )}
            </div>
          ))}
        </div>

        {addingField && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={(e) => {
              // Only close if clicking the overlay
              if (e.target === e.currentTarget) {
                setAddingField(null);
              }
            }}
          >
            <div 
              className="bg-white rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()} // Prevent clicks from reaching the overlay
              onMouseDown={(e) => e.stopPropagation()} // Prevent drag events from affecting the modal
            >
              <h3 className="text-lg font-medium mb-4">Ajouter un nouveau champ</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nom du champ
                  </label>
                  <input
                    type="text"
                    value={addingField.fieldName}
                    onChange={(e) => setAddingField({ ...addingField, fieldName: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Type de champ
                  </label>
                  <select
                    value={addingField.fieldType}
                    onChange={(e) => setAddingField({ ...addingField, fieldType: e.target.value as FieldType })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  >
                    <option value="string">Texte</option>
                    <option value="number">Nombre</option>
                    <option value="boolean">Booléen</option>
                    <option value="array">Liste</option>
                    <option value="object">Objet</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setAddingField(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (addingField.fieldName) {
                        handleAddField(
                          addingField.sectionPath.split('.'),
                          addingField.fieldName,
                          addingField.fieldType
                        );
                      }
                    }}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                    disabled={!addingField.fieldName}
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="sticky bottom-0 bg-white border-t mt-6 p-4 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Sauvegarder
          </button>
        </div>
      </form>
    </DragDropContext>
  );
}
