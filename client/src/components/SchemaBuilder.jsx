import React, { useState } from 'react';

export function SchemaBuilder() {
  // REAL WORLD TEMPLATES THAT MAKE SENSE
  const SCHEMA_TEMPLATES = {
    'inventory-simple': {
      name: '📦 Inventory System (Simple)',
      description: 'Users own products. Products are organized into categories. That\'s it.',
      tables: [
        {
          name: 'User',
          columns: [
            { name: 'id', type: 'Integer', isPrimaryKey: true },
            { name: 'name', type: 'String', length: 80 },
            { name: 'email', type: 'String', length: 120 }
          ],
          relationships: [
            { name: 'products', targetTable: 'Product', type: 'one-to-many', backPopulates: 'user' }
          ]
        },
        {
          name: 'Product',
          columns: [
            { name: 'id', type: 'Integer', isPrimaryKey: true },
            { name: 'name', type: 'String', length: 80 },
            { name: 'rack', type: 'String', length: 80 },
            { name: 'bin', type: 'String', length: 80 },
            { name: 'user_id', type: 'Integer', isForeignKey: true, references: 'users.id' },
            { name: 'category_id', type: 'Integer', isForeignKey: true, references: 'categories.id' }
          ],
          relationships: [
            { name: 'user', targetTable: 'User', type: 'many-to-one', backPopulates: 'products' },
            { name: 'category', targetTable: 'Category', type: 'many-to-one', backPopulates: 'products' }
          ]
        },
        {
          name: 'Category',
          columns: [
            { name: 'id', type: 'Integer', isPrimaryKey: true },
            { name: 'name', type: 'String', length: 80 }
          ],
          relationships: [
            { name: 'products', targetTable: 'Product', type: 'one-to-many', backPopulates: 'category' }
          ]
        }
      ],
      queryStyle: 'fetch-light',
      explanation: `
REAL WORLD LOGIC:
- User logs in
- Get their products: Product.query.filter_by(user_id=current_user.id).all()
- Want to filter by category? Products already have category_id
- Display categories as buttons by getting unique categories from user's products

NO user.categories NEEDED. Just:
  products = current_user.products
  categories = set(p.category for p in products)
  # Now make buttons for each category
      `
    },
    'blog-posts': {
      name: '📝 Blog System',
      description: 'Users write posts. Posts have tags. Users don\'t "have" tags.',
      tables: [
        {
          name: 'User',
          columns: [
            { name: 'id', type: 'Integer', isPrimaryKey: true },
            { name: 'username', type: 'String', length: 80 },
            { name: 'email', type: 'String', length: 120 }
          ],
          relationships: [
            { name: 'posts', targetTable: 'Post', type: 'one-to-many', backPopulates: 'author' }
          ]
        },
        {
          name: 'Post',
          columns: [
            { name: 'id', type: 'Integer', isPrimaryKey: true },
            { name: 'title', type: 'String', length: 200 },
            { name: 'content', type: 'String', length: 5000 },
            { name: 'user_id', type: 'Integer', isForeignKey: true, references: 'users.id' },
            { name: 'tag_id', type: 'Integer', isForeignKey: true, references: 'tags.id' }
          ],
          relationships: [
            { name: 'author', targetTable: 'User', type: 'many-to-one', backPopulates: 'posts' },
            { name: 'tag', targetTable: 'Tag', type: 'many-to-one', backPopulates: 'posts' }
          ]
        },
        {
          name: 'Tag',
          columns: [
            { name: 'id', type: 'Integer', isPrimaryKey: true },
            { name: 'name', type: 'String', length: 50 }
          ],
          relationships: [
            { name: 'posts', targetTable: 'Post', type: 'one-to-many', backPopulates: 'tag' }
          ]
        }
      ],
      queryStyle: 'fetch-light',
      explanation: `
MAKES SENSE:
- User writes posts
- Posts are tagged with categories
- Frontend: Get user's posts, then filter/display by tag

NO user.tags relationship. Just:
  posts = current_user.posts
  tags = set(p.tag for p in posts)
  # Display tag filter buttons
      `
    },
    'e-commerce': {
      name: '🛒 E-Commerce Orders',
      description: 'Users place orders. Orders contain items. Items are products.',
      tables: [
        {
          name: 'User',
          columns: [
            { name: 'id', type: 'Integer', isPrimaryKey: true },
            { name: 'name', type: 'String', length: 80 },
            { name: 'email', type: 'String', length: 120 }
          ],
          relationships: [
            { name: 'orders', targetTable: 'Order', type: 'one-to-many', backPopulates: 'customer' }
          ]
        },
        {
          name: 'Order',
          columns: [
            { name: 'id', type: 'Integer', isPrimaryKey: true },
            { name: 'order_date', type: 'DateTime' },
            { name: 'total', type: 'Integer' },
            { name: 'user_id', type: 'Integer', isForeignKey: true, references: 'users.id' }
          ],
          relationships: [
            { name: 'customer', targetTable: 'User', type: 'many-to-one', backPopulates: 'orders' },
            { name: 'items', targetTable: 'OrderItem', type: 'one-to-many', backPopulates: 'order' }
          ]
        },
        {
          name: 'OrderItem',
          columns: [
            { name: 'id', type: 'Integer', isPrimaryKey: true },
            { name: 'quantity', type: 'Integer' },
            { name: 'price', type: 'Integer' },
            { name: 'order_id', type: 'Integer', isForeignKey: true, references: 'orders.id' },
            { name: 'product_id', type: 'Integer', isForeignKey: true, references: 'products.id' }
          ],
          relationships: [
            { name: 'order', targetTable: 'Order', type: 'many-to-one', backPopulates: 'items' },
            { name: 'product', targetTable: 'Product', type: 'many-to-one', backPopulates: 'order_items' }
          ]
        },
        {
          name: 'Product',
          columns: [
            { name: 'id', type: 'Integer', isPrimaryKey: true },
            { name: 'name', type: 'String', length: 120 },
            { name: 'price', type: 'Integer' }
          ],
          relationships: [
            { name: 'order_items', targetTable: 'OrderItem', type: 'one-to-many', backPopulates: 'product' }
          ]
        }
      ],
      queryStyle: 'fetch-light',
      explanation: `
USER FLOW:
- User places order
- Order has items
- Each item is a product with quantity

Query: current_user.orders
Then: for order in orders: order.items
      `
    },
    'task-manager': {
      name: '✅ Task Manager',
      description: 'Users create tasks. Tasks have priorities. Simple.',
      tables: [
        {
          name: 'User',
          columns: [
            { name: 'id', type: 'Integer', isPrimaryKey: true },
            { name: 'name', type: 'String', length: 80 }
          ],
          relationships: [
            { name: 'tasks', targetTable: 'Task', type: 'one-to-many', backPopulates: 'owner' }
          ]
        },
        {
          name: 'Task',
          columns: [
            { name: 'id', type: 'Integer', isPrimaryKey: true },
            { name: 'title', type: 'String', length: 200 },
            { name: 'completed', type: 'Boolean' },
            { name: 'priority', type: 'String', length: 20 },
            { name: 'user_id', type: 'Integer', isForeignKey: true, references: 'users.id' }
          ],
          relationships: [
            { name: 'owner', targetTable: 'User', type: 'many-to-one', backPopulates: 'tasks' }
          ]
        }
      ],
      queryStyle: 'fetch-light',
      explanation: `
SIMPLE:
- User has tasks
- Tasks have priority field (high, medium, low)
- Filter in Python or frontend

Query: current_user.tasks.filter_by(completed=False)
Filter: [t for t in tasks if t.priority == 'high']
      `
    },
    'social-media': {
      name: '📱 Social Media Posts',
      description: 'Users create posts. Users can like posts. Comments on posts.',
      tables: [
        {
          name: 'User',
          columns: [
            { name: 'id', type: 'Integer', isPrimaryKey: true },
            { name: 'username', type: 'String', length: 80 }
          ],
          relationships: [
            { name: 'posts', targetTable: 'Post', type: 'one-to-many', backPopulates: 'author' },
            { name: 'comments', targetTable: 'Comment', type: 'one-to-many', backPopulates: 'author' }
          ]
        },
        {
          name: 'Post',
          columns: [
            { name: 'id', type: 'Integer', isPrimaryKey: true },
            { name: 'content', type: 'String', length: 500 },
            { name: 'created_at', type: 'DateTime' },
            { name: 'user_id', type: 'Integer', isForeignKey: true, references: 'users.id' }
          ],
          relationships: [
            { name: 'author', targetTable: 'User', type: 'many-to-one', backPopulates: 'posts' },
            { name: 'comments', targetTable: 'Comment', type: 'one-to-many', backPopulates: 'post' },
            { name: 'likes', targetTable: 'Like', type: 'one-to-many', backPopulates: 'post' }
          ]
        },
        {
          name: 'Comment',
          columns: [
            { name: 'id', type: 'Integer', isPrimaryKey: true },
            { name: 'text', type: 'String', length: 300 },
            { name: 'user_id', type: 'Integer', isForeignKey: true, references: 'users.id' },
            { name: 'post_id', type: 'Integer', isForeignKey: true, references: 'posts.id' }
          ],
          relationships: [
            { name: 'author', targetTable: 'User', type: 'many-to-one', backPopulates: 'comments' },
            { name: 'post', targetTable: 'Post', type: 'many-to-one', backPopulates: 'comments' }
          ]
        },
        {
          name: 'Like',
          columns: [
            { name: 'id', type: 'Integer', isPrimaryKey: true },
            { name: 'user_id', type: 'Integer', isForeignKey: true, references: 'users.id' },
            { name: 'post_id', type: 'Integer', isForeignKey: true, references: 'posts.id' }
          ],
          relationships: [
            { name: 'user', targetTable: 'User', type: 'many-to-one', backPopulates: 'likes' },
            { name: 'post', targetTable: 'Post', type: 'many-to-one', backPopulates: 'likes' }
          ]
        }
      ],
      queryStyle: 'fetch-light',
      explanation: `
REAL APP:
- User creates posts
- Posts have comments and likes
- Query: current_user.posts (just the user's posts)
- Query: Post.query.all() (feed of all posts)
      `
    },
    'custom': {
      name: '🛠️ Custom Schema',
      description: 'Build your own from scratch',
      tables: [
        {
          name: 'NewTable',
          columns: [
            { name: 'id', type: 'Integer', isPrimaryKey: true }
          ],
          relationships: []
        }
      ],
      queryStyle: 'custom',
      explanation: 'Start from scratch and build what you need'
    }
  };

  const [selectedTemplate, setSelectedTemplate] = useState('inventory-simple');
  const [tables, setTables] = useState(JSON.parse(JSON.stringify(SCHEMA_TEMPLATES['inventory-simple'].tables)));
  const [queryStyle, setQueryStyle] = useState(SCHEMA_TEMPLATES['inventory-simple'].queryStyle);
  const [activeTab, setActiveTab] = useState('template-picker');
  const [expandedTables, setExpandedTables] = useState({});
  const [copiedTab, setCopiedTab] = useState(null);

  // Style constants
  const SURFACE_COLOR = '#1e293b';
  const BACKGROUND_COLOR = '#0f172a';
  const BORDER_COLOR = '#334155';
  const TEXT_COLOR = '#f1f5f9';
  const BUTTON_PRIMARY = '#0ea5e9';
  const BUTTON_SUCCESS = '#10b981';
  const BUTTON_DANGER = '#ef4444';
  const ACCENT_COLOR = '#8b5cf6';
  const HIGHLIGHT_COLOR = '#f59e0b';

  // Copy to clipboard function
  const copyToClipboard = async (text, tabName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTab(tabName);
      setTimeout(() => setCopiedTab(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Load template
  const loadTemplate = (templateKey) => {
    const template = SCHEMA_TEMPLATES[templateKey];
    setSelectedTemplate(templateKey);
    setTables(JSON.parse(JSON.stringify(template.tables)));
    setQueryStyle(template.queryStyle);
    setActiveTab('outline');
  };

  // Toggle table expansion
  const toggleTable = (tableIndex) => {
    setExpandedTables(prev => ({
      ...prev,
      [tableIndex]: !prev[tableIndex]
    }));
  };

  // CRUD operations
  const addTable = () => {
    setTables([...tables, {
      name: 'NewTable',
      columns: [{ name: 'id', type: 'Integer', isPrimaryKey: true }],
      relationships: []
    }]);
  };

  const deleteTable = (tableIndex) => {
    const newTables = tables.filter((_, index) => index !== tableIndex);
    setTables(newTables);
  };

  const updateTableName = (tableIndex, newName) => {
    const newTables = [...tables];
    newTables[tableIndex].name = newName;
    setTables(newTables);
  };

  const addColumn = (tableIndex) => {
    const newTables = [...tables];
    newTables[tableIndex].columns.push({
      name: 'new_column',
      type: 'String',
      length: 80
    });
    setTables(newTables);
  };

  const deleteColumn = (tableIndex, colIndex) => {
    const newTables = [...tables];
    newTables[tableIndex].columns = newTables[tableIndex].columns.filter((_, index) => index !== colIndex);
    setTables(newTables);
  };

  const addRelationship = (tableIndex) => {
    const newTables = [...tables];
    const otherTable = tables.find((t, i) => i !== tableIndex);
    newTables[tableIndex].relationships.push({
      name: 'new_relationship',
      targetTable: otherTable ? otherTable.name : 'User',
      type: 'many-to-one',
      backPopulates: 'items'
    });
    setTables(newTables);
  };

  const deleteRelationship = (tableIndex, relIndex) => {
    const newTables = [...tables];
    newTables[tableIndex].relationships = newTables[tableIndex].relationships.filter((_, index) => index !== relIndex);
    setTables(newTables);
  };

  const updateColumn = (tableIndex, colIndex, field, value) => {
    const newTables = [...tables];
    newTables[tableIndex].columns[colIndex][field] = value;
    setTables(newTables);
  };

  const updateRelationship = (tableIndex, relIndex, field, value) => {
    const newTables = [...tables];
    newTables[tableIndex].relationships[relIndex][field] = value;
    setTables(newTables);
  };

  // Generate relationship description
  const getRelationshipText = (rel, tableName) => {
    if (rel.type === 'one-to-many') {
      return `${tableName} has many ${rel.targetTable}s`;
    } else if (rel.type === 'many-to-one') {
      return `${tableName} belongs to ${rel.targetTable}`;
    } else if (rel.type === 'many-to-many') {
      return `${tableName} ↔ ${rel.targetTable}`;
    }
    return `${tableName} → ${rel.targetTable}`;
  };

  // Code generation with CORRECT back_populates
  const generateModels = () => {
    let code = `# Generated SQLAlchemy Models\n\n`;
    
    tables.forEach(table => {
      code += `class ${table.name}(db.Model):\n`;
      code += `    __tablename__ = '${table.name.toLowerCase()}s'\n\n`;
      
      // Columns
      table.columns.forEach(col => {
        let line = `    ${col.name} = db.Column(db.${col.type}`;
        if (col.length && col.type === 'String') line += `(${col.length})`;
        if (col.isPrimaryKey) line += `, primary_key=True`;
        if (col.isForeignKey) line += `, db.ForeignKey('${col.references}')`;
        line += `)\n`;
        code += line;
      });
      
      code += '\n';
      
      // Relationships with CORRECT back_populates
      table.relationships.forEach(rel => {
        code += `    ${rel.name} = db.relationship('${rel.targetTable}', back_populates='${rel.backPopulates || rel.name}')\n`;
      });
      
      code += '\n';
    });
    
    return code;
  };

  const generateSchemas = () => {
    let code = '# Generated Marshmallow Schemas\n\n';
    
    tables.forEach(table => {
      code += `class ${table.name}Schema(ma.SQLAlchemyAutoSchema):\n`;
      code += `    class Meta:\n`;
      code += `        model = ${table.name}\n`;
      code += `        load_instance = True\n`;
      
      const passwordField = table.columns.find(c => c.name.includes('password'));
      if (passwordField) {
        code += `        exclude = ('${passwordField.name}',)\n`;
      }
      
      code += `\n`;
      code += `${table.name.toLowerCase()}_schema = ${table.name}Schema()\n`;
      code += `${table.name.toLowerCase()}s_schema = ${table.name}Schema(many=True)\n\n`;
    });
    
    return code;
  };

  const generateSQL = () => {
    let code = '-- Generated SQL\n\n';
    
    tables.forEach(table => {
      code += `CREATE TABLE ${table.name.toLowerCase()}s (\n`;
      
      const columnDefs = table.columns.map(col => {
        let def = `    ${col.name} `;
        if (col.type === 'Integer') def += 'INTEGER';
        if (col.type === 'String') def += `VARCHAR(${col.length || 255})`;
        if (col.type === 'Boolean') def += 'BOOLEAN';
        if (col.type === 'DateTime') def += 'TIMESTAMP';
        if (col.isPrimaryKey) def += ' PRIMARY KEY';
        return def;
      });

      const fkDefs = table.columns
        .filter(col => col.isForeignKey)
        .map(col => {
          const [refTable, refCol] = col.references.split('.');
          return `    FOREIGN KEY (${col.name}) REFERENCES ${refTable.toLowerCase()}s(${refCol})`;
        });

      const combinedDefs = columnDefs.concat(fkDefs);
      code += combinedDefs.join(',\n');
      code += '\n);\n\n';
    });
    
    return code;
  };

  // Common styles
  const buttonStyle = {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s',
    fontFamily: 'inherit'
  };

  const inputStyle = {
    padding: '10px 14px',
    borderRadius: '6px',
    border: `1px solid ${BORDER_COLOR}`,
    backgroundColor: BACKGROUND_COLOR,
    color: TEXT_COLOR,
    fontSize: '14px',
    fontFamily: 'monospace',
    width: '100%'
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: BACKGROUND_COLOR,
      color: TEXT_COLOR,
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '12px', color: TEXT_COLOR }}>
            🗃️ Schema Builder
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>
            Real-world database patterns that actually make sense
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginBottom: '32px',
          borderBottom: `2px solid ${BORDER_COLOR}`,
          paddingBottom: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {['template-picker', 'outline', 'models', 'schemas', 'sql'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                ...buttonStyle,
                backgroundColor: activeTab === tab ? BUTTON_PRIMARY : 'transparent',
                color: activeTab === tab ? '#fff' : TEXT_COLOR,
                border: activeTab === tab ? 'none' : `1px solid ${BORDER_COLOR}`
              }}
            >
              {tab === 'template-picker' && '🎨 Templates'}
              {tab === 'outline' && '📋 Schema'}
              {tab === 'models' && '🐍 Models'}
              {tab === 'schemas' && '📦 Schemas'}
              {tab === 'sql' && '💾 SQL'}
            </button>
          ))}
        </div>

        {/* TEMPLATE PICKER */}
        {activeTab === 'template-picker' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>
            {Object.entries(SCHEMA_TEMPLATES).map(([key, template]) => (
              <div
                key={key}
                onClick={() => loadTemplate(key)}
                style={{
                  backgroundColor: selectedTemplate === key ? ACCENT_COLOR + '20' : SURFACE_COLOR,
                  border: `2px solid ${selectedTemplate === key ? ACCENT_COLOR : BORDER_COLOR}`,
                  borderRadius: '16px',
                  padding: '28px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  position: 'relative',
                  minHeight: '320px'
                }}
              >
                {selectedTemplate === key && (
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    backgroundColor: ACCENT_COLOR,
                    color: '#fff',
                    padding: '6px 14px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    ✓ SELECTED
                  </div>
                )}
                
                <h3 style={{ fontSize: '1.6rem', marginBottom: '14px', color: TEXT_COLOR }}>
                  {template.name}
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '15px', marginBottom: '20px', lineHeight: '1.6' }}>
                  {template.description}
                </p>
                
                <div style={{
                  backgroundColor: BACKGROUND_COLOR,
                  padding: '18px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  color: '#94a3b8',
                  marginTop: '18px',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.6'
                }}>
                  {template.explanation}
                </div>

                <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {template.tables.map(table => (
                    <span key={table.name} style={{
                      backgroundColor: BUTTON_PRIMARY + '30',
                      color: BUTTON_PRIMARY,
                      padding: '6px 14px',
                      borderRadius: '14px',
                      fontSize: '13px',
                      fontWeight: 'bold'
                    }}>
                      {table.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* OUTLINE VIEW */}
        {activeTab === 'outline' && (
          <div>
            {tables.map((table, tableIndex) => (
              <div
                key={tableIndex}
                style={{
                  backgroundColor: SURFACE_COLOR,
                  borderRadius: '12px',
                  marginBottom: '24px',
                  border: `1px solid ${BORDER_COLOR}`,
                  overflow: 'hidden'
                }}
              >
                {/* Table Header */}
                <div
                  style={{
                    padding: '20px 24px',
                    backgroundColor: expandedTables[tableIndex] ? ACCENT_COLOR + '20' : 'transparent',
                    borderBottom: expandedTables[tableIndex] ? `1px solid ${BORDER_COLOR}` : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onClick={() => toggleTable(tableIndex)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                    <span style={{ fontSize: '20px' }}>
                      {expandedTables[tableIndex] ? '▼' : '▶'}
                    </span>
                    <input
                      value={table.name}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateTableName(tableIndex, e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        ...inputStyle,
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderBottom: `2px solid ${BORDER_COLOR}`,
                        borderRadius: 0,
                        width: 'auto',
                        minWidth: '200px'
                      }}
                    />
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTable(tableIndex);
                    }}
                    style={{
                      ...buttonStyle,
                      backgroundColor: BUTTON_DANGER,
                      color: '#fff',
                      padding: '8px 16px',
                      fontSize: '12px'
                    }}
                  >
                    🗑 Delete
                  </button>
                </div>

                {/* Table Content */}
                {expandedTables[tableIndex] && (
                  <div style={{ padding: '24px' }}>
                    
                    {/* Relationships Summary */}
                    {table.relationships.length > 0 && (
                      <div style={{ 
                        marginBottom: '24px', 
                        padding: '20px',
                        backgroundColor: BACKGROUND_COLOR,
                        borderRadius: '12px',
                        border: `2px solid ${ACCENT_COLOR}40`
                      }}>
                        <h4 style={{ color: ACCENT_COLOR, marginBottom: '16px', fontSize: '1rem' }}>
                          🔗 Relationships
                        </h4>
                        {table.relationships.map((rel, idx) => (
                          <div key={idx} style={{ 
                            color: '#94a3b8', 
                            fontSize: '15px', 
                            marginBottom: '8px',
                            padding: '8px',
                            backgroundColor: SURFACE_COLOR,
                            borderRadius: '6px'
                          }}>
                            {getRelationshipText(rel, table.name)}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Columns Section */}
                    <div style={{ marginBottom: '32px' }}>
                      <h3 style={{ 
                        fontSize: '1rem', 
                        marginBottom: '16px',
                        color: BUTTON_PRIMARY,
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                      }}>
                        📊 Columns
                      </h3>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {table.columns.map((col, colIndex) => (
                          <div
                            key={colIndex}
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '2fr 1.5fr 80px auto auto auto 40px',
                              gap: '12px',
                              alignItems: 'center',
                              padding: '14px',
                              backgroundColor: BACKGROUND_COLOR,
                              borderRadius: '8px',
                              border: `1px solid ${BORDER_COLOR}`
                            }}
                          >
                            <input
                              value={col.name}
                              onChange={(e) => updateColumn(tableIndex, colIndex, 'name', e.target.value)}
                              placeholder="column_name"
                              style={inputStyle}
                            />
                            
                            <select
                              value={col.type}
                              onChange={(e) => updateColumn(tableIndex, colIndex, 'type', e.target.value)}
                              style={inputStyle}
                            >
                              <option>Integer</option>
                              <option>String</option>
                              <option>Boolean</option>
                              <option>DateTime</option>
                            </select>

                            {col.type === 'String' && (
                              <input
                                type="number"
                                value={col.length || 80}
                                onChange={(e) => updateColumn(tableIndex, colIndex, 'length', e.target.value)}
                                placeholder="80"
                                style={{ ...inputStyle, width: '60px' }}
                              />
                            )}

                            <label style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '6px',
                              fontSize: '12px',
                              whiteSpace: 'nowrap',
                              color: col.isPrimaryKey ? BUTTON_SUCCESS : TEXT_COLOR,
                              fontWeight: col.isPrimaryKey ? 'bold' : 'normal'
                            }}>
                              <input
                                type="checkbox"
                                checked={col.isPrimaryKey || false}
                                onChange={(e) => updateColumn(tableIndex, colIndex, 'isPrimaryKey', e.target.checked)}
                              />
                              PK
                            </label>

                            <label style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '6px',
                              fontSize: '12px',
                              whiteSpace: 'nowrap',
                              color: col.isForeignKey ? ACCENT_COLOR : TEXT_COLOR,
                              fontWeight: col.isForeignKey ? 'bold' : 'normal'
                            }}>
                              <input
                                type="checkbox"
                                checked={col.isForeignKey || false}
                                onChange={(e) => updateColumn(tableIndex, colIndex, 'isForeignKey', e.target.checked)}
                              />
                              FK
                            </label>

                            {col.isForeignKey && (
                              <input
                                value={col.references || ''}
                                onChange={(e) => updateColumn(tableIndex, colIndex, 'references', e.target.value)}
                                placeholder="users.id"
                                style={{ ...inputStyle, gridColumn: 'span 2' }}
                              />
                            )}

                            <button
                              onClick={() => deleteColumn(tableIndex, colIndex)}
                              style={{
                                ...buttonStyle,
                                backgroundColor: 'transparent',
                                color: BUTTON_DANGER,
                                padding: '4px',
                                fontSize: '18px'
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => addColumn(tableIndex)}
                        style={{
                          ...buttonStyle,
                          backgroundColor: BUTTON_SUCCESS,
                          color: '#fff',
                          marginTop: '12px'
                        }}
                      >
                        + Add Column
                      </button>
                    </div>

                    {/* Relationships Section */}
                    <div>
                      <h3 style={{ 
                        fontSize: '1rem', 
                        marginBottom: '16px',
                        color: ACCENT_COLOR,
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                      }}>
                        🔗 Relationships
                      </h3>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {table.relationships.map((rel, relIndex) => (
                          <div
                            key={relIndex}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px',
                              padding: '16px',
                              backgroundColor: BACKGROUND_COLOR,
                              borderRadius: '8px',
                              border: `2px solid ${ACCENT_COLOR}40`
                            }}
                          >
                            {/* Row 1: Name and Target */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                                  Relationship Name
                                </label>
                                <input
                                  value={rel.name}
                                  onChange={(e) => updateRelationship(tableIndex, relIndex, 'name', e.target.value)}
                                  placeholder="products"
                                  style={inputStyle}
                                />
                              </div>
                              
                              <div>
                                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                                  Target Table
                                </label>
                                <select
                                  value={rel.targetTable}
                                  onChange={(e) => updateRelationship(tableIndex, relIndex, 'targetTable', e.target.value)}
                                  style={inputStyle}
                                >
                                  {tables.map(t => (
                                    <option key={t.name} value={t.name}>{t.name}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* Row 2: Type, back_populates, and Delete Button */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', alignItems: 'flex-end' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                                  Relationship Type
                                </label>
                                <select
                                  value={rel.type}
                                  onChange={(e) => updateRelationship(tableIndex, relIndex, 'type', e.target.value)}
                                  style={inputStyle}
                                >
                                  <option value="one-to-many">One-to-Many (has many →)</option>
                                  <option value="many-to-one">Many-to-One (← belongs to)</option>
                                  <option value="many-to-many">Many-to-Many (↔)</option>
                                </select>
                              </div>

                              <div>
                                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                                  back_populates
                                </label>
                                <input
                                  value={rel.backPopulates || ''}
                                  onChange={(e) => updateRelationship(tableIndex, relIndex, 'backPopulates', e.target.value)}
                                  placeholder="relationship name on other table"
                                  style={inputStyle}
                                />
                              </div>

                              <button
                                onClick={() => deleteRelationship(tableIndex, relIndex)}
                                style={{
                                  ...buttonStyle,
                                  backgroundColor: BUTTON_DANGER,
                                  color: '#fff',
                                  padding: '10px 16px',
                                  fontSize: '14px'
                                }}
                              >
                                Delete
                              </button>
                            </div>

                            {/* Human-readable description */}
                            <div style={{
                              padding: '8px 12px',
                              backgroundColor: SURFACE_COLOR,
                              borderRadius: '6px',
                              fontSize: '13px',
                              color: '#94a3b8',
                              fontStyle: 'italic'
                            }}>
                              {getRelationshipText(rel, table.name)} 
                              {rel.backPopulates && ` ↔ back_populates="${rel.backPopulates}"`}
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => addRelationship(tableIndex)}
                        style={{
                          ...buttonStyle,
                          backgroundColor: ACCENT_COLOR,
                          color: '#fff',
                          marginTop: '12px'
                        }}
                      >
                        + Add Relationship
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Add Table Button */}
            {selectedTemplate === 'custom' && (
              <button
                onClick={addTable}
                style={{
                  ...buttonStyle,
                  backgroundColor: BUTTON_PRIMARY,
                  color: '#fff',
                  width: '100%',
                  padding: '16px',
                  fontSize: '16px'
                }}
              >
                + Add New Table
              </button>
            )}
          </div>
        )}

        {/* CODE VIEWS WITH COPY BUTTONS */}
        {activeTab === 'models' && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => copyToClipboard(generateModels(), 'models')}
              style={{
                ...buttonStyle,
                position: 'absolute',
                top: '20px',
                right: '20px',
                backgroundColor: copiedTab === 'models' ? BUTTON_SUCCESS : BUTTON_PRIMARY,
                color: '#fff',
                zIndex: 10
              }}
            >
              {copiedTab === 'models' ? '✓ Copied!' : '📋 Copy'}
            </button>
            <pre style={{
              backgroundColor: '#1e1e1e',
              color: '#d4d4d4',
              padding: '24px',
              borderRadius: '12px',
              overflow: 'auto',
              fontSize: '14px',
              lineHeight: '1.8',
              border: `1px solid ${BORDER_COLOR}`
            }}>
              {generateModels()}
            </pre>
          </div>
        )}

        {activeTab === 'schemas' && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => copyToClipboard(generateSchemas(), 'schemas')}
              style={{
                ...buttonStyle,
                position: 'absolute',
                top: '20px',
                right: '20px',
                backgroundColor: copiedTab === 'schemas' ? BUTTON_SUCCESS : BUTTON_PRIMARY,
                color: '#fff',
                zIndex: 10
              }}
            >
              {copiedTab === 'schemas' ? '✓ Copied!' : '📋 Copy'}
            </button>
            <pre style={{
              backgroundColor: '#1e1e1e',
              color: '#d4d4d4',
              padding: '24px',
              borderRadius: '12px',
              overflow: 'auto',
              fontSize: '14px',
              lineHeight: '1.8',
              border: `1px solid ${BORDER_COLOR}`
            }}>
              {generateSchemas()}
            </pre>
          </div>
        )}

        {activeTab === 'sql' && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => copyToClipboard(generateSQL(), 'sql')}
              style={{
                ...buttonStyle,
                position: 'absolute',
                top: '20px',
                right: '20px',
                backgroundColor: copiedTab === 'sql' ? BUTTON_SUCCESS : BUTTON_PRIMARY,
                color: '#fff',
                zIndex: 10
              }}
            >
              {copiedTab === 'sql' ? '✓ Copied!' : '📋 Copy'}
            </button>
            <pre style={{
              backgroundColor: '#1e1e1e',
              color: '#d4d4d4',
              padding: '24px',
              borderRadius: '12px',
              overflow: 'auto',
              fontSize: '14px',
              lineHeight: '1.8',
              border: `1px solid ${BORDER_COLOR}`
            }}>
              {generateSQL()}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}