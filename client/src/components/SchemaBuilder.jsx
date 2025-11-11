import React, { useState, useRef } from 'react';

export function SchemaBuilder() {
  const [mode, setMode] = useState('choose'); // choose, plain-english, outline, visual, results
  const [projectData, setProjectData] = useState({
    tables: [],
    relationships: []
  });

  // Styles
  const BG = '#0f172a';
  const SURFACE = '#1e293b';
  const BORDER = '#334155';
  const TEXT = '#f1f5f9';
  const PRIMARY = '#0ea5e9';
  const SUCCESS = '#10b981';
  const WARNING = '#f59e0b';
  const DANGER = '#ef4444';
  const ACCENT = '#8b5cf6';

  const buttonStyle = {
    padding: '16px 32px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.2s',
    fontFamily: 'inherit'
  };

  // ==============================================
  // MODE SELECTOR
  // ==============================================
  const ModeSelector = () => (
    <div>
      <h1 style={{ fontSize: '3rem', marginBottom: '16px', textAlign: 'center' }}>
        🚀 Ultimate Backend Generator
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '1.2rem', textAlign: 'center', marginBottom: '48px' }}>
        Choose your preferred way to design your database
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Plain English */}
        <div
          onClick={() => setMode('plain-english')}
          style={{
            padding: '32px',
            backgroundColor: SURFACE,
            borderRadius: '16px',
            border: `2px solid ${BORDER}`,
            cursor: 'pointer',
            transition: 'all 0.3s',
            ':hover': { borderColor: PRIMARY }
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📝</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px', color: PRIMARY }}>
            Plain English
          </h2>
          <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>
            Just type it out:<br/>
            "User owns Products"<br/>
            "Product belongs to Category"<br/>
            Done.
          </p>
          <div style={{ marginTop: '20px', color: SUCCESS, fontWeight: 'bold' }}>
            ⚡ Fastest
          </div>
        </div>

        {/* Outline Builder */}
        <div
          onClick={() => setMode('outline')}
          style={{
            padding: '32px',
            backgroundColor: SURFACE,
            borderRadius: '16px',
            border: `2px solid ${BORDER}`,
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🌳</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px', color: WARNING }}>
            Outline Tree
          </h2>
          <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>
            Expand/collapse like a file system:<br/>
            📁 User<br/>
            &nbsp;&nbsp;└ 📄 Products<br/>
            Click to define relationships.
          </p>
          <div style={{ marginTop: '20px', color: WARNING, fontWeight: 'bold' }}>
            📊 Most Visual
          </div>
        </div>

        {/* Drag & Drop */}
        <div
          onClick={() => setMode('visual')}
          style={{
            padding: '32px',
            backgroundColor: SURFACE,
            borderRadius: '16px',
            border: `2px solid ${BORDER}`,
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎨</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px', color: ACCENT }}>
            Drag & Drop
          </h2>
          <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>
            Visual canvas:<br/>
            Drag boxes around<br/>
            Draw arrows between them<br/>
            See it come to life!
          </p>
          <div style={{ marginTop: '20px', color: ACCENT, fontWeight: 'bold' }}>
            🎯 Most Intuitive
          </div>
        </div>
      </div>
    </div>
  );

  // ==============================================
  // MODE 1: PLAIN ENGLISH
  // ==============================================
  const PlainEnglishMode = () => {
    const [text, setText] = useState('User owns Products\nProduct belongs to Category\nProduct belongs to User');

    const parseEnglish = () => {
      const lines = text.split('\n').filter(l => l.trim());
      const tables = new Set();
      const relationships = [];

      lines.forEach(line => {
        const lower = line.toLowerCase().trim();
        
        // Pattern: "X owns Y" or "X has Y"
        const ownsMatch = lower.match(/^(\w+)\s+(owns?|has|have)\s+(\w+)s?$/);
        if (ownsMatch) {
          const owner = capitalize(ownsMatch[1]);
          const owned = capitalize(ownsMatch[3]);
          tables.add(owner);
          tables.add(owned);
          relationships.push({
            from: owner,
            to: owned,
            type: 'owns',
            foreignKey: `${owner.toLowerCase()}_id`
          });
        }

        // Pattern: "X belongs to Y"
        const belongsMatch = lower.match(/^(\w+)s?\s+belongs?\s+to\s+(\w+)$/);
        if (belongsMatch) {
          const owned = capitalize(belongsMatch[1]);
          const owner = capitalize(belongsMatch[2]);
          tables.add(owner);
          tables.add(owned);
          relationships.push({
            from: owner,
            to: owned,
            type: 'owns',
            foreignKey: `${owner.toLowerCase()}_id`
          });
        }

        // Pattern: "X classified by Y" or "X organized by Y"
        const classifiedMatch = lower.match(/^(\w+)s?\s+(classified|organized|categorized)\s+by\s+(\w+)$/);
        if (classifiedMatch) {
          const item = capitalize(classifiedMatch[1]);
          const classifier = capitalize(classifiedMatch[3]);
          tables.add(item);
          tables.add(classifier);
          relationships.push({
            from: classifier,
            to: item,
            type: 'classifies',
            foreignKey: `${classifier.toLowerCase()}_id`
          });
        }
      });

      // Build table objects
      const tableObjects = Array.from(tables).map(name => ({
        name,
        columns: [
          { name: 'id', type: 'Integer', isPrimaryKey: true },
          { name: 'name', type: 'String', length: 80 }
        ]
      }));

      // Add foreign key columns
      relationships.forEach(rel => {
        const table = tableObjects.find(t => t.name === rel.to);
        if (table && !table.columns.find(c => c.name === rel.foreignKey)) {
          table.columns.push({
            name: rel.foreignKey,
            type: 'Integer',
            isForeignKey: true,
            references: `${rel.from.toLowerCase()}s.id`
          });
        }
      });

      setProjectData({ tables: tableObjects, relationships });
      generateCode({ tables: tableObjects, relationships });
      setMode('results');
    };

    return (
      <div>
        <button
          onClick={() => setMode('choose')}
          style={{
            ...buttonStyle,
            backgroundColor: 'transparent',
            color: TEXT,
            border: `2px solid ${BORDER}`,
            marginBottom: '24px'
          }}
        >
          ← Back
        </button>

        <h2 style={{ fontSize: '2rem', marginBottom: '24px', color: PRIMARY }}>
          📝 Plain English Mode
        </h2>

        <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: SURFACE, borderRadius: '12px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '12px', color: TEXT }}>
            How to write it:
          </h3>
          <ul style={{ color: '#94a3b8', lineHeight: '2' }}>
            <li><strong style={{ color: SUCCESS }}>Ownership:</strong> "User owns Products" or "User has Products"</li>
            <li><strong style={{ color: WARNING }}>Classification:</strong> "Product classified by Category"</li>
            <li><strong style={{ color: ACCENT }}>Reverse:</strong> "Product belongs to User"</li>
          </ul>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="User owns Products&#10;Product belongs to Category&#10;Post has Comments&#10;Comment belongs to User"
          style={{
            width: '100%',
            minHeight: '300px',
            padding: '20px',
            fontSize: '16px',
            fontFamily: 'monospace',
            backgroundColor: SURFACE,
            color: TEXT,
            border: `2px solid ${BORDER}`,
            borderRadius: '12px',
            resize: 'vertical',
            marginBottom: '24px'
          }}
        />

        <button
          onClick={parseEnglish}
          style={{
            ...buttonStyle,
            backgroundColor: PRIMARY,
            color: '#fff',
            width: '100%',
            padding: '20px',
            fontSize: '18px'
          }}
        >
          🚀 Generate Backend Code
        </button>
      </div>
    );
  };

  // ==============================================
  // MODE 2: OUTLINE TREE
  // ==============================================
  const OutlineMode = () => {
    const [tables, setTables] = useState([
      { name: 'User', expanded: true, owns: [], classifiedBy: [] },
      { name: 'Product', expanded: false, owns: [], classifiedBy: [] },
      { name: 'Category', expanded: false, owns: [], classifiedBy: [] }
    ]);
    const [newTableName, setNewTableName] = useState('');

    const addTable = () => {
      if (!newTableName.trim()) return;
      setTables([...tables, { 
        name: capitalize(newTableName.trim()), 
        expanded: false, 
        owns: [], 
        classifiedBy: [] 
      }]);
      setNewTableName('');
    };

    const toggleExpanded = (idx) => {
      setTables(tables.map((t, i) => i === idx ? { ...t, expanded: !t.expanded } : t));
    };

    const addOwnership = (ownerIdx, ownedName) => {
      setTables(tables.map((t, i) => 
        i === ownerIdx && !t.owns.includes(ownedName)
          ? { ...t, owns: [...t.owns, ownedName] }
          : t
      ));
    };

    const addClassification = (itemIdx, classifierName) => {
      setTables(tables.map((t, i) => 
        i === itemIdx && !t.classifiedBy.includes(classifierName)
          ? { ...t, classifiedBy: [...t.classifiedBy, classifierName] }
          : t
      ));
    };

    const generateFromOutline = () => {
      const tableObjects = tables.map(t => ({
        name: t.name,
        columns: [
          { name: 'id', type: 'Integer', isPrimaryKey: true },
          { name: 'name', type: 'String', length: 80 }
        ]
      }));

      const relationships = [];

      tables.forEach(table => {
        // Add foreign keys for things this table owns
        table.owns.forEach(ownedName => {
          const ownedTable = tableObjects.find(t => t.name === ownedName);
          if (ownedTable) {
            const fkName = `${table.name.toLowerCase()}_id`;
            if (!ownedTable.columns.find(c => c.name === fkName)) {
              ownedTable.columns.push({
                name: fkName,
                type: 'Integer',
                isForeignKey: true,
                references: `${table.name.toLowerCase()}s.id`
              });
            }
            relationships.push({ from: table.name, to: ownedName, type: 'owns' });
          }
        });

        // Add foreign keys for things that classify this table
        table.classifiedBy.forEach(classifierName => {
          const thisTable = tableObjects.find(t => t.name === table.name);
          if (thisTable) {
            const fkName = `${classifierName.toLowerCase()}_id`;
            if (!thisTable.columns.find(c => c.name === fkName)) {
              thisTable.columns.push({
                name: fkName,
                type: 'Integer',
                isForeignKey: true,
                references: `${classifierName.toLowerCase()}s.id`
              });
            }
            relationships.push({ from: classifierName, to: table.name, type: 'classifies' });
          }
        });
      });

      setProjectData({ tables: tableObjects, relationships });
      generateCode({ tables: tableObjects, relationships });
      setMode('results');
    };

    return (
      <div>
        <button
          onClick={() => setMode('choose')}
          style={{
            ...buttonStyle,
            backgroundColor: 'transparent',
            color: TEXT,
            border: `2px solid ${BORDER}`,
            marginBottom: '24px'
          }}
        >
          ← Back
        </button>

        <h2 style={{ fontSize: '2rem', marginBottom: '24px', color: WARNING }}>
          🌳 Outline Tree Mode
        </h2>

        <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
          <input
            value={newTableName}
            onChange={(e) => setNewTableName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTable()}
            placeholder="New table name..."
            style={{
              flex: 1,
              padding: '14px',
              fontSize: '16px',
              backgroundColor: SURFACE,
              color: TEXT,
              border: `2px solid ${BORDER}`,
              borderRadius: '8px'
            }}
          />
          <button
            onClick={addTable}
            style={{
              ...buttonStyle,
              backgroundColor: SUCCESS,
              color: '#fff'
            }}
          >
            + Add Table
          </button>
        </div>

        <div style={{ marginBottom: '32px' }}>
          {tables.map((table, idx) => (
            <div key={idx} style={{ marginBottom: '12px' }}>
              <div
                onClick={() => toggleExpanded(idx)}
                style={{
                  padding: '16px',
                  backgroundColor: SURFACE,
                  border: `2px solid ${BORDER}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}
              >
                <span style={{ fontSize: '20px' }}>{table.expanded ? '📂' : '📁'}</span>
                <span style={{ color: TEXT }}>{table.name}</span>
                {(table.owns.length > 0 || table.classifiedBy.length > 0) && (
                  <span style={{ marginLeft: 'auto', color: '#64748b', fontSize: '14px' }}>
                    {table.owns.length + table.classifiedBy.length} relationships
                  </span>
                )}
              </div>

              {table.expanded && (
                <div style={{ marginLeft: '32px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* What does this table OWN? */}
                  <div style={{ padding: '16px', backgroundColor: BG, borderRadius: '8px' }}>
                    <div style={{ color: SUCCESS, fontWeight: 'bold', marginBottom: '12px' }}>
                      ✓ {table.name} owns:
                    </div>
                    {table.owns.length === 0 ? (
                      <div style={{ color: '#64748b', fontStyle: 'italic' }}>Nothing yet</div>
                    ) : (
                      table.owns.map((owned, i) => (
                        <div key={i} style={{ color: TEXT, marginBottom: '4px' }}>
                          └ {owned}
                        </div>
                      ))
                    )}
                    <select
                      onChange={(e) => {
                        if (e.target.value) addOwnership(idx, e.target.value);
                        e.target.value = '';
                      }}
                      style={{
                        marginTop: '8px',
                        padding: '8px',
                        backgroundColor: SURFACE,
                        color: TEXT,
                        border: `1px solid ${BORDER}`,
                        borderRadius: '6px',
                        width: '100%'
                      }}
                    >
                      <option value="">+ Add ownership...</option>
                      {tables.filter(t => t.name !== table.name).map((t, i) => (
                        <option key={i} value={t.name}>{t.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* What CLASSIFIES this table? */}
                  <div style={{ padding: '16px', backgroundColor: BG, borderRadius: '8px' }}>
                    <div style={{ color: WARNING, fontWeight: 'bold', marginBottom: '12px' }}>
                      🏷️ {table.name} classified by:
                    </div>
                    {table.classifiedBy.length === 0 ? (
                      <div style={{ color: '#64748b', fontStyle: 'italic' }}>Nothing yet</div>
                    ) : (
                      table.classifiedBy.map((classifier, i) => (
                        <div key={i} style={{ color: TEXT, marginBottom: '4px' }}>
                          └ {classifier}
                        </div>
                      ))
                    )}
                    <select
                      onChange={(e) => {
                        if (e.target.value) addClassification(idx, e.target.value);
                        e.target.value = '';
                      }}
                      style={{
                        marginTop: '8px',
                        padding: '8px',
                        backgroundColor: SURFACE,
                        color: TEXT,
                        border: `1px solid ${BORDER}`,
                        borderRadius: '6px',
                        width: '100%'
                      }}
                    >
                      <option value="">+ Add classification...</option>
                      {tables.filter(t => t.name !== table.name).map((t, i) => (
                        <option key={i} value={t.name}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={generateFromOutline}
          style={{
            ...buttonStyle,
            backgroundColor: PRIMARY,
            color: '#fff',
            width: '100%',
            padding: '20px',
            fontSize: '18px'
          }}
        >
          🚀 Generate Backend Code
        </button>
      </div>
    );
  };

  // ==============================================
  // MODE 3: VISUAL DRAG & DROP
  // ==============================================
  const VisualMode = () => {
    const [tables, setTables] = useState([
      { id: 1, name: 'User', x: 100, y: 100 },
      { id: 2, name: 'Product', x: 400, y: 100 },
      { id: 3, name: 'Category', x: 700, y: 100 }
    ]);
    const [connections, setConnections] = useState([]);
    const [dragging, setDragging] = useState(null);
    const [connecting, setConnecting] = useState(null);
    const canvasRef = useRef(null);

    const handleMouseDown = (e, tableId) => {
      if (e.shiftKey) {
        setConnecting(tableId);
      } else {
        setDragging(tableId);
      }
    };

    const handleMouseMove = (e) => {
      if (dragging !== null) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setTables(tables.map(t => 
          t.id === dragging ? { ...t, x: x - 75, y: y - 40 } : t
        ));
      }
    };

    const handleMouseUp = (e, tableId) => {
      if (connecting !== null && tableId && connecting !== tableId) {
        const fromTable = tables.find(t => t.id === connecting);
        const toTable = tables.find(t => t.id === tableId);
        
        setConnections([...connections, {
          from: connecting,
          to: tableId,
          fromName: fromTable.name,
          toName: toTable.name,
          type: 'owns'
        }]);
      }
      setDragging(null);
      setConnecting(null);
    };

    const generateFromVisual = () => {
      const tableObjects = tables.map(t => ({
        name: t.name,
        columns: [
          { name: 'id', type: 'Integer', isPrimaryKey: true },
          { name: 'name', type: 'String', length: 80 }
        ]
      }));

      connections.forEach(conn => {
        const toTable = tableObjects.find(t => t.name === conn.toName);
        if (toTable) {
          const fkName = `${conn.fromName.toLowerCase()}_id`;
          if (!toTable.columns.find(c => c.name === fkName)) {
            toTable.columns.push({
              name: fkName,
              type: 'Integer',
              isForeignKey: true,
              references: `${conn.fromName.toLowerCase()}s.id`
            });
          }
        }
      });

      setProjectData({ tables: tableObjects, relationships: connections });
      generateCode({ tables: tableObjects, relationships: connections });
      setMode('results');
    };

    return (
      <div>
        <button
          onClick={() => setMode('choose')}
          style={{
            ...buttonStyle,
            backgroundColor: 'transparent',
            color: TEXT,
            border: `2px solid ${BORDER}`,
            marginBottom: '24px'
          }}
        >
          ← Back
        </button>

        <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: ACCENT }}>
          🎨 Visual Drag & Drop Mode
        </h2>

        <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: SURFACE, borderRadius: '12px' }}>
          <div style={{ color: '#94a3b8', fontSize: '14px' }}>
            <strong style={{ color: TEXT }}>How to use:</strong><br/>
            • Drag boxes to move them<br/>
            • Hold SHIFT + Drag from one box to another to connect<br/>
            • Arrow means "from owns to"
          </div>
        </div>

        <div
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseUp={() => handleMouseUp(null, null)}
          style={{
            position: 'relative',
            width: '100%',
            height: '500px',
            backgroundColor: BG,
            border: `2px solid ${BORDER}`,
            borderRadius: '12px',
            marginBottom: '24px',
            cursor: dragging ? 'grabbing' : 'default'
          }}
        >
          {/* Draw connections */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            {connections.map((conn, idx) => {
              const from = tables.find(t => t.id === conn.from);
              const to = tables.find(t => t.id === conn.to);
              if (!from || !to) return null;
              return (
                <line
                  key={idx}
                  x1={from.x + 75}
                  y1={from.y + 40}
                  x2={to.x + 75}
                  y2={to.y + 40}
                  stroke={PRIMARY}
                  strokeWidth="3"
                  markerEnd="url(#arrowhead)"
                />
              );
            })}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill={PRIMARY} />
              </marker>
            </defs>
          </svg>

          {/* Draw tables */}
          {tables.map(table => (
            <div
              key={table.id}
              onMouseDown={(e) => handleMouseDown(e, table.id)}
              onMouseUp={(e) => handleMouseUp(e, table.id)}
              style={{
                position: 'absolute',
                left: table.x,
                top: table.y,
                width: '150px',
                height: '80px',
                backgroundColor: SURFACE,
                border: `3px solid ${connecting === table.id ? SUCCESS : PRIMARY}`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: 'grab',
                userSelect: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              {table.name}
            </div>
          ))}
        </div>

        <button
          onClick={generateFromVisual}
          style={{
            ...buttonStyle,
            backgroundColor: PRIMARY,
            color: '#fff',
            width: '100%',
            padding: '20px',
            fontSize: '18px'
          }}
        >
          🚀 Generate Backend Code
        </button>
      </div>
    );
  };

  // ==============================================
  // RESULTS VIEW
  // ==============================================
  const [generatedCode, setGeneratedCode] = useState({});

  const generateCode = (data) => {
    // Generate models
    let models = '# models.py\nfrom extensions import db\n\n';
    data.tables.forEach(table => {
      models += `class ${table.name}(db.Model):\n`;
      models += `    __tablename__ = '${table.name.toLowerCase()}s'\n\n`;
      table.columns.forEach(col => {
        let line = `    ${col.name} = db.Column(db.${col.type}`;
        if (col.length) line += `(${col.length})`;
        if (col.isPrimaryKey) line += ', primary_key=True';
        if (col.isForeignKey) line += `, db.ForeignKey('${col.references}')`;
        line += ')\n';
        models += line;
      });
      models += '\n';

      // Add relationships
      data.relationships.forEach(rel => {
        if (rel.from === table.name) {
          models += `    ${rel.to.toLowerCase()}s = db.relationship('${rel.to}', back_populates='${table.name.toLowerCase()}')\n`;
        }
        if (rel.to === table.name) {
          models += `    ${rel.from.toLowerCase()} = db.relationship('${rel.from}', back_populates='${table.name.toLowerCase()}s')\n`;
        }
      });

      models += '\n';
    });

    setGeneratedCode({ models });
  };

  const ResultsView = () => {
    const [copied, setCopied] = useState(false);

    const copyCode = () => {
      navigator.clipboard.writeText(generatedCode.models);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div>
        <h2 style={{ fontSize: '2rem', marginBottom: '24px', color: SUCCESS }}>
          ✅ Your Backend is Ready!
        </h2>

        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <button
            onClick={copyCode}
            style={{
              ...buttonStyle,
              position: 'absolute',
              top: '16px',
              right: '16px',
              backgroundColor: copied ? SUCCESS : PRIMARY,
              color: '#fff',
              zIndex: 10
            }}
          >
            {copied ? '✓ Copied!' : '📋 Copy'}
          </button>

          <pre style={{
            backgroundColor: '#1e1e1e',
            color: '#d4d4d4',
            padding: '24px',
            borderRadius: '12px',
            overflow: 'auto',
            fontSize: '14px',
            lineHeight: '1.8',
            maxHeight: '600px'
          }}>
            {generatedCode.models}
          </pre>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <button
            onClick={() => setMode('choose')}
            style={{
              ...buttonStyle,
              backgroundColor: SURFACE,
              color: TEXT,
              border: `2px solid ${BORDER}`,
              flex: 1
            }}
          >
            ← Start Over
          </button>
          <button
            onClick={() => setMode(mode === 'plain-english' ? 'plain-english' : mode === 'outline' ? 'outline' : 'visual')}
            style={{
              ...buttonStyle,
              backgroundColor: WARNING,
              color: '#fff',
              flex: 1
            }}
          >
            ← Back to Editor
          </button>
        </div>
      </div>
    );
  };

  // Helper function
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  // ==============================================
  // MAIN RENDER
  // ==============================================
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: BG,
      color: TEXT,
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          padding: '32px',
          backgroundColor: SURFACE,
          borderRadius: '16px',
          border: `2px solid ${BORDER}`
        }}>
          {mode === 'choose' && <ModeSelector />}
          {mode === 'plain-english' && <PlainEnglishMode />}
          {mode === 'outline' && <OutlineMode />}
          {mode === 'visual' && <VisualMode />}
          {mode === 'results' && <ResultsView />}
        </div>
      </div>
    </div>
  );
}