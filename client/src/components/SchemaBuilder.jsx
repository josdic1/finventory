import React, { useReducer, useState } from 'react';
import { Plus, Trash2, ArrowRight, Code, Database, Route, Clipboard } from 'lucide-react';

// --- STYLING CONSTANTS (from Ultimate Backend Generator) ---
const BG = '#0f172a';
const SURFACE = '#1e293b';
const BORDER = '#334155';
const TEXT = '#f1f5f9';
const PRIMARY = '#0ea5e9'; // Sky Blue
const SUCCESS = '#10b981'; // Emerald Green
const WARNING = '#f59e0b'; // Amber Yellow
const ACCENT = '#8b5cf6'; // Fuchsia Pink (used for routes code)
const DANGER = '#ef4444'; // Red

const buttonStyle = {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
};

// Utility functions (Unchanged)
const toSnakeCase = (str) => {
    if (!str) return '';
    return str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
};

const pluralize = (word) => {
    if (!word) return '';
    if (word.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(word.slice(-2, -1).toLowerCase())) {
        return word.slice(0, -1) + 'ies';
    }
    if (word.endsWith('s') || word.endsWith('x') || word.endsWith('z') || word.endsWith('ch') || word.endsWith('sh')) {
        return word + 'es';
    }
    return word + 's';
};

function getBridgeTableName(entity1, entity2) {
    const sorted = [entity1, entity2].sort();
    return `${toSnakeCase(sorted[0])}_${toSnakeCase(pluralize(sorted[1]))}`;
}

function processRelationships(entities, relationships) {
    const entityRelationships = {};
    const Boolean = (val) => !!val;

    entities.forEach(e => { if (e.name) entityRelationships[e.name] = []; });

    relationships.forEach(rel => {
        const { entity1, entity2, entity1HasMany, entity2HasMany } = rel;
        if (entity1HasMany === null || entity2HasMany === null) return;
        if (!entity1HasMany && !entity2HasMany) return;

        if (entity1HasMany && entity2HasMany) {
            entityRelationships[entity1].push({
                type: 'many-to-many',
                target: entity2,
                backPopulates: toSnakeCase(pluralize(entity1)),
                relationshipName: toSnakeCase(pluralize(entity2))
            });
            entityRelationships[entity2].push({
                type: 'many-to-many',
                target: entity1,
                backPopulates: toSnakeCase(pluralize(entity2)),
                relationshipName: toSnakeCase(pluralize(entity1))
            });
        } else if (entity1HasMany && !entity2HasMany) {
            entityRelationships[entity1].push({
                type: 'one-to-many',
                target: entity2,
                backPopulates: toSnakeCase(entity1),
                relationshipName: toSnakeCase(pluralize(entity2))
            });
            entityRelationships[entity2].push({
                type: 'many-to-one',
                target: entity1,
                backPopulates: toSnakeCase(pluralize(entity2)),
                relationshipName: toSnakeCase(entity1)
            });
        } else if (!entity1HasMany && entity2HasMany) {
            entityRelationships[entity2].push({
                type: 'one-to-many',
                target: entity1,
                backPopulates: toSnakeCase(entity2),
                relationshipName: toSnakeCase(pluralize(entity1))
            });
            entityRelationships[entity1].push({
                type: 'many-to-one',
                target: entity2,
                backPopulates: toSnakeCase(pluralize(entity1)),
                relationshipName: toSnakeCase(entity2)
            });
        }
    });
    return entityRelationships;
}

function generateModelsCode(entities, entityRelationships, projectName) {
    let code = `# Generated Models for ${projectName}\n\n`;
    code += `from .extensions import db\n`;
    code += `from datetime import datetime, timezone\n\n`;

    const bridgeTables = new Set();
    const Boolean = (val) => !!val;

    Object.entries(entityRelationships).forEach(([entityName, rels]) => {
        rels.filter(r => r.type === 'many-to-many').forEach(rel => {
            const bridgeName = getBridgeTableName(entityName, rel.target);

            if (!bridgeTables.has(bridgeName)) {
                bridgeTables.add(bridgeName);
                const sorted = [entityName, rel.target].sort();

                code += `${bridgeName} = db.Table('${bridgeName}',\n`;
                code += `    db.Column('${toSnakeCase(sorted[0])}_id', db.Integer, db.ForeignKey('${toSnakeCase(pluralize(sorted[0]))}.id'), primary_key=True),\n`;
                code += `    db.Column('${toSnakeCase(sorted[1])}_id', db.Integer, db.ForeignKey('${toSnakeCase(pluralize(sorted[1]))}.id'), primary_key=True)\n`;
                code += `)\n\n`;
            }
        });
    });

    entities.forEach(entity => {
        if (!entity.name) return;
        const rels = entityRelationships[entity.name] || [];

        code += `class ${entity.name}(db.Model):\n`;
        code += `    __tablename__ = '${toSnakeCase(pluralize(entity.name))}'\n\n`;
        code += `    id = db.Column(db.Integer, primary_key=True)\n`;

        entity.fields.forEach(field => {
            if (field.name) {
                let dbType;
                switch (field.type) {
                    case 'String': dbType = 'db.String(255)'; break;
                    case 'Integer': dbType = 'db.Integer'; break;
                    case 'Boolean': dbType = 'db.Boolean'; break;
                    case 'DateTime': dbType = 'db.DateTime'; break;
                    default: dbType = 'db.String(255)';
                }
                let columnArgs = field.name.toLowerCase() === 'name' ? 'nullable=False, unique=True' : 'nullable=True';
                code += `    ${toSnakeCase(field.name)} = db.Column(${dbType}, ${columnArgs})\n`;
            }
        });

        rels.filter(r => r.type === 'many-to-one').forEach(rel => {
            code += `    ${toSnakeCase(rel.target)}_id = db.Column(db.Integer, db.ForeignKey('${toSnakeCase(pluralize(rel.target))}.id'), nullable=False)\n`;
        });

        code += `    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))\n`;
        code += `    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))\n\n`;

        if (rels.length > 0) {
            code += `    # Relationships\n`;
            rels.forEach(rel => {
                code += `    ${rel.relationshipName} = db.relationship('${rel.target}', back_populates='${rel.backPopulates}'`;
                if (rel.type === 'one-to-many') code += `, cascade='all, delete-orphan'`;
                if (rel.type === 'many-to-many') {
                    const bridgeName = getBridgeTableName(entity.name, rel.target);
                    code += `, secondary=${bridgeName}`;
                }
                code += `)\n`;
            });
        }

        const hasNameField = entity.fields.some(f => f.name.toLowerCase() === 'name');
        code += `\n    def __repr__(self):\n`;
        code += `        return f'<${entity.name} {self.${hasNameField ? 'name' : 'id'}}>'\n\n\n`;
    });

    return code;
}

function generateSchemasCode(entities, entityRelationships) {
    let code = `from .extensions import ma\n`;
    const Boolean = (val) => !!val;
    code += `from .models import ${entities.map(e => e.name).filter(Boolean).join(', ')}\n\n`;

    entities.forEach(entity => {
        if (!entity.name) return;
        const rels = entityRelationships[entity.name] || [];

        code += `class ${entity.name}Schema(ma.SQLAlchemyAutoSchema):\n`;

        if (rels.length > 0) {
            rels.forEach(rel => {
                const isMany = rel.type !== 'many-to-one';
                code += `    ${rel.relationshipName} = ma.Nested('${rel.target}Schema', many=${isMany}, exclude=('${rel.backPopulates}',))\n`;
            });
            code += `\n`;
        }

        code += `    class Meta:\n`;
        code += `        model = ${entity.name}\n`;
        code += `        load_instance = True\n`;
        code += `        include_fk = True\n\n`;
    });

    code += `# Schema instances\n`;
    entities.forEach(entity => {
        if (entity.name) {
            code += `${toSnakeCase(entity.name)}_schema = ${entity.name}Schema()\n`;
            code += `${toSnakeCase(pluralize(entity.name))}_schema = ${entity.name}Schema(many=True)\n`;
        }
    });

    return code;
}

function generateRoutesCode(entities, entityRelationships, projectName) {
    let code = `# Generated Routes for ${projectName}\n\n`;
    const Boolean = (val) => !!val;
    code += `from flask import Blueprint, request, jsonify\n`;
    code += `from marshmallow import ValidationError\n`;
    code += `from .extensions import db\n`;
    code += `from .models import ${entities.map(e => e.name).filter(Boolean).join(', ')}\n`;
    code += `from .schemas import (\n`;

    const imports = [];
    entities.forEach(e => {
        if (e.name) {
            const s = toSnakeCase(e.name);
            const p = toSnakeCase(pluralize(e.name));
            imports.push(`    ${s}_schema, ${p}_schema`);
        }
    });
    code += imports.join(',\n') + '\n)\n\n';
    code += `api_bp = Blueprint('api', __name__)\n\n`;

    entities.forEach(entity => {
        if (!entity.name) return;

        const entitySnake = toSnakeCase(entity.name);
        const entityPluralSnake = toSnakeCase(pluralize(entity.name));
        const schemaName = `${entitySnake}_schema`;
        const schemaPluralName = `${entityPluralSnake}_schema`;

        code += `# ${entity.name.toUpperCase()} ROUTES\n`;
        code += `@api_bp.route('/${entityPluralSnake}', methods=['GET'])\n`;
        code += `def get_${entityPluralSnake}():\n`;
        code += `    items = ${entity.name}.query.all()\n`;
        code += `    return jsonify(${schemaPluralName}.dump(items))\n\n`;

        code += `@api_bp.route('/${entityPluralSnake}/<int:id>', methods=['GET'])\n`;
        code += `def get_${entitySnake}(id):\n`;
        code += `    item = ${entity.name}.query.get_or_404(id)\n`;
        code += `    return jsonify(${schemaName}.dump(item))\n\n`;

        code += `@api_bp.route('/${entityPluralSnake}', methods=['POST'])\n`;
        code += `def create_${entitySnake}():\n`;
        code += `    data = request.get_json()\n`;
        code += `    try:\n`;
        code += `        item = ${schemaName}.load(data, session=db.session)\n`;
        code += `        db.session.commit()\n`;
        code += `        return jsonify(${schemaName}.dump(item)), 201\n`;
        code += `    except ValidationError as err:\n`;
        code += `        return jsonify({'errors': err.messages}), 400\n`;
        code += `    except Exception as e:\n`;
        code += `        return jsonify({'error': str(e)}), 400\n\n`;

        code += `@api_bp.route('/${entityPluralSnake}/<int:id>', methods=['PUT'])\n`;
        code += `def update_${entitySnake}(id):\n`;
        code += `    item = ${entity.name}.query.get_or_404(id)\n`;
        code += `    data = request.get_json()\n`;
        code += `    try:\n`;
        code += `        item = ${schemaName}.load(data, instance=item, session=db.session, partial=True)\n`;
        code += `        db.session.commit()\n`;
        code += `        return jsonify(${schemaName}.dump(item))\n`;
        code += `    except ValidationError as err:\n`;
        code += `        return jsonify({'errors': err.messages}), 400\n`;
        code += `    except Exception as e:\n`;
        code += `        return jsonify({'error': str(e)}), 400\n\n`;

        code += `@api_bp.route('/${entityPluralSnake}/<int:id>', methods=['DELETE'])\n`;
        code += `def delete_${entitySnake}(id):\n`;
        code += `    item = ${entity.name}.query.get_or_404(id)\n`;
        code += `    db.session.delete(item)\n`;
        code += `    db.session.commit()\n`;
        code += `    return '', 204\n\n`;
    });

    code += `@api_bp.route('/health', methods=['GET'])\n`;
    code += `def health_check():\n`;
    code += `    return jsonify({'status': 'healthy', 'project': '${projectName}'})\n`;

    return code;
}

const initialState = {
    step: 1,
    projectName: '',
    entities: [{ name: '', fields: [] }],
    currentEntityIndex: 0,
    relationships: [],
    generatedCode: { models: '', schemas: '', routes: '' },
};

function reducer(state, action) {
    switch (action.type) {
        case 'SET_STEP':
            return { ...state, step: action.payload };
        case 'SET_PROJECT_NAME':
            return { ...state, projectName: action.payload };
        case 'ADD_ENTITY':
            return { ...state, entities: [...state.entities, { name: '', fields: [] }] };
        case 'REMOVE_ENTITY':
            if (state.entities.length <= 1) return state;
            return { ...state, entities: state.entities.filter((_, i) => i !== action.payload) };
        case 'UPDATE_ENTITY_NAME':
            const cleanName = action.payload.name
                .replace(/\s+/g, '')
                .replace(/[^a-zA-Z]/g, '')
                .replace(/^\w/, c => c.toUpperCase());
            return {
                ...state, entities: state.entities.map((e, i) =>
                    i === action.payload.index ? { ...e, name: cleanName } : e
                )
            };
        case 'SET_CURRENT_ENTITY_INDEX':
            return { ...state, currentEntityIndex: action.payload };
        case 'ADD_FIELD': {
            const newEntities = [...state.entities];
            newEntities[action.payload].fields.push({ name: '', type: 'String' });
            return { ...state, entities: newEntities };
        }
        case 'REMOVE_FIELD': {
            const newEntities = [...state.entities];
            newEntities[action.payload.entityIndex].fields = newEntities[action.payload.entityIndex].fields.filter((_, i) => i !== action.payload.fieldIndex);
            return { ...state, entities: newEntities };
        }
        case 'UPDATE_FIELD': {
            const newEntities = [...state.entities];
            newEntities[action.payload.entityIndex].fields[action.payload.fieldIndex][action.payload.key] = action.payload.value;
            return { ...state, entities: newEntities };
        }
        case 'SET_RELATIONSHIPS':
            return { ...state, relationships: action.payload };
        case 'UPDATE_RELATIONSHIP':
            return {
                ...state, relationships: state.relationships.map((r, i) =>
                    i === action.payload.index ? { ...r, [action.payload.key]: action.payload.value } : r
                )
            };
        case 'SET_GENERATED_CODE':
            return { ...state, generatedCode: action.payload };
        case 'RESET':
            return initialState;
        default:
            throw new Error();
    }
}

export function SchemaBuilder() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { step, projectName, entities, currentEntityIndex, relationships, generatedCode } = state;
    const [copiedCode, setCopiedCode] = useState(null);

    const askRelationships = () => {
        const rels = [];
        const validEntities = entities.filter(e => e.name);
        for (let i = 0; i < validEntities.length; i++) {
            for (let j = i + 1; j < validEntities.length; j++) {
                rels.push({
                    entity1: validEntities[i].name,
                    entity2: validEntities[j].name,
                    entity1HasMany: null,
                    entity2HasMany: null
                });
            }
        }
        dispatch({ type: 'SET_RELATIONSHIPS', payload: rels });
        dispatch({ type: 'SET_STEP', payload: 3 });
    };

    const handleGenerateCode = () => {
        const entityRelationships = processRelationships(entities, relationships);
        const models = generateModelsCode(entities, entityRelationships, projectName);
        const schemas = generateSchemasCode(entities, entityRelationships);
        const routes = generateRoutesCode(entities, entityRelationships, projectName);

        dispatch({ type: 'SET_GENERATED_CODE', payload: { models, schemas, routes } });
        dispatch({ type: 'SET_STEP', payload: 4 });
    };

    const copyToClipboard = (code, label) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(label);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: BG, color: TEXT, padding: '40px 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ backgroundColor: SURFACE, borderRadius: '16px', boxShadow: '0 10px 15px rgba(0,0,0,0.3)', padding: '32px', border: `2px solid ${BORDER}` }}>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
                            <Database style={{ width: '36px', height: '36px', color: PRIMARY }} />
                            Ultimate Backend Generator
                        </h1>
                        <p style={{ color: '#94a3b8' }}>Models, Schemas, and API Routes for Flask/SQLAlchemy/Marshmallow</p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {[1, 2, 3, 4].map(num => (
                                <React.Fragment key={num}>
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
                                        backgroundColor: step >= num ? PRIMARY : BORDER,
                                        color: step >= num ? 'white' : '#94a3b8',
                                        transition: 'background-color 0.3s'
                                    }}>{num}</div>
                                    {num < 4 && <ArrowRight style={{ width: '20px', height: '20px', color: BORDER }} />}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <div style={{ borderTop: `1px solid ${BORDER}`, margin: '32px 0' }}></div>

                    {step === 1 && (
                        <div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: PRIMARY, marginBottom: '24px' }}>Step 1: Define Your Tables 📁</h2>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#94a3b8', marginBottom: '8px' }}>Project Name</label>
                                <input type="text" value={projectName} onChange={(e) => dispatch({ type: 'SET_PROJECT_NAME', payload: e.target.value })} placeholder="e.g., Music Tracker"
                                    style={{
                                        width: '100%', padding: '16px', border: `2px solid ${BORDER}`, backgroundColor: BG, borderRadius: '8px', color: TEXT, outline: 'none',
                                        boxSizing: 'border-box'
                                    }} />
                            </div>
                            <div style={{ marginBottom: '32px' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#94a3b8', marginBottom: '12px' }}>Tables</label>
                                {entities.map((entity, index) => (
                                    <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'center' }}>
                                        <input type="text" value={entity.name} onChange={(e) => dispatch({ type: 'UPDATE_ENTITY_NAME', payload: { index, name: e.target.value } })} placeholder="Entity name (e.g., User)"
                                            style={{
                                                flex: 1, padding: '12px', border: `2px solid ${BORDER}`, backgroundColor: BG, borderRadius: '8px', color: TEXT, outline: 'none',
                                            }} />
                                        {entities.length > 1 && (
                                            <button onClick={() => dispatch({ type: 'REMOVE_ENTITY', payload: index })}
                                                style={{ ...buttonStyle, padding: '10px 14px', backgroundColor: DANGER, color: 'white' }}>
                                                <Trash2 style={{ width: '20px', height: '20px' }} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button onClick={() => dispatch({ type: 'ADD_ENTITY' })}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', color: SUCCESS, fontWeight: '600', marginTop: '16px', background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <Plus style={{ width: '20px', height: '20px', color: SUCCESS }} /> Add Table
                                </button>
                            </div>
                            <button onClick={() => dispatch({ type: 'SET_STEP', payload: 2 })} disabled={!projectName || entities.filter(e => e.name).length < 1}
                                style={{
                                    ...buttonStyle, backgroundColor: PRIMARY, color: 'white', width: '100%', padding: '20px', fontSize: '18px',
                                    opacity: (!projectName || entities.filter(e => e.name).length < 1) ? 0.5 : 1, pointerEvents: (!projectName || entities.filter(e => e.name).length < 1) ? 'none' : 'auto'
                                }}>
                                Next: Add Fields →
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: PRIMARY, marginBottom: '24px' }}>Step 2: Add Fields 📝</h2>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                                {entities.filter(e => e.name).map((entity, index) => (
                                    <button key={index} onClick={() => dispatch({ type: 'SET_CURRENT_ENTITY_INDEX', payload: index })}
                                        style={{
                                            ...buttonStyle, padding: '8px 16px', borderRadius: '20px',
                                            backgroundColor: currentEntityIndex === index ? PRIMARY : BORDER,
                                            color: currentEntityIndex === index ? 'white' : '#94a3b8',
                                        }}>
                                        {entity.name}
                                    </button>
                                ))}
                            </div>
                            {entities[currentEntityIndex] && (
                                <div style={{ backgroundColor: BORDER, padding: '24px', borderRadius: '12px', marginBottom: '24px', border: `1px solid ${PRIMARY}` }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: TEXT, marginBottom: '16px' }}>{entities[currentEntityIndex].name} Fields (ID, Dates auto-added)</h3>
                                    {entities[currentEntityIndex].fields.map((field, fieldIndex) => (
                                        <div key={fieldIndex} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center', padding: '8px', backgroundColor: BG, borderRadius: '8px' }}>
                                            <input type="text" value={field.name} onChange={(e) => dispatch({ type: 'UPDATE_FIELD', payload: { entityIndex: currentEntityIndex, fieldIndex, key: 'name', value: e.target.value } })} placeholder="field_name"
                                                style={{ flex: 1, padding: '8px', border: `1px solid ${BORDER}`, backgroundColor: SURFACE, borderRadius: '4px', color: TEXT }} />
                                            <select value={field.type} onChange={(e) => dispatch({ type: 'UPDATE_FIELD', payload: { entityIndex: currentEntityIndex, fieldIndex, key: 'type', value: e.target.value } })}
                                                style={{ padding: '8px', border: `1px solid ${BORDER}`, backgroundColor: SURFACE, borderRadius: '4px', color: TEXT }}>
                                                <option>String</option>
                                                <option>Integer</option>
                                                <option>Boolean</option>
                                                <option>DateTime</option>
                                            </select>
                                            <button onClick={() => dispatch({ type: 'REMOVE_FIELD', payload: { entityIndex: currentEntityIndex, fieldIndex } })}
                                                style={{ ...buttonStyle, padding: '8px', backgroundColor: 'transparent', color: DANGER }}>
                                                <Trash2 style={{ width: '20px', height: '20px' }} />
                                            </button>
                                        </div>
                                    ))}
                                    <button onClick={() => dispatch({ type: 'ADD_FIELD', payload: currentEntityIndex })}
                                        style={{ display: 'flex', alignItems: 'center', gap: '8px', color: SUCCESS, fontWeight: '600', marginTop: '16px', background: 'none', border: 'none', cursor: 'pointer' }}>
                                        <Plus style={{ width: '20px', height: '20px', color: SUCCESS }} /> Add Field
                                    </button>
                                </div>
                            )}
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <button onClick={() => dispatch({ type: 'SET_STEP', payload: 1 })}
                                    style={{ ...buttonStyle, backgroundColor: BORDER, color: TEXT, border: `1px solid ${BORDER}` }}>
                                    ← Back
                                </button>
                                <button onClick={askRelationships}
                                    style={{ ...buttonStyle, flex: 1, backgroundColor: PRIMARY, color: 'white' }}
                                    disabled={entities.filter(e => e.name).length < 2}>
                                    Next: Define Relationships →
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: PRIMARY, marginBottom: '24px' }}>Step 3: Define Relationships 🔗</h2>
                            {relationships.map((rel, index) => (
                                <div key={index} style={{ backgroundColor: BORDER, padding: '24px', borderRadius: '12px', marginBottom: '24px', border: `2px solid ${ACCENT}` }}>
                                    <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '16px', color: TEXT }}>
                                        <span style={{ color: WARNING }}>{rel.entity1}</span> ↔ <span style={{ color: ACCENT }}>{rel.entity2}</span>
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div>
                                            <p style={{ fontWeight: '600', marginBottom: '8px', color: '#c3c9d7' }}>Can one **{rel.entity1}** have multiple **{pluralize(rel.entity2)}**?</p>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                                <button onClick={() => dispatch({ type: 'UPDATE_RELATIONSHIP', payload: { index, key: 'entity1HasMany', value: false } })}
                                                    style={{
                                                        ...buttonStyle, padding: '12px 20px', border: `2px solid ${rel.entity1HasMany === false ? SUCCESS : BORDER}`,
                                                        backgroundColor: rel.entity1HasMany === false ? SUCCESS : SURFACE, color: 'white'
                                                    }}>
                                                    No (One)
                                                </button>
                                                <button onClick={() => dispatch({ type: 'UPDATE_RELATIONSHIP', payload: { index, key: 'entity1HasMany', value: true } })}
                                                    style={{
                                                        ...buttonStyle, padding: '12px 20px', border: `2px solid ${rel.entity1HasMany === true ? SUCCESS : BORDER}`,
                                                        backgroundColor: rel.entity1HasMany === true ? SUCCESS : SURFACE, color: 'white'
                                                    }}>
                                                    Yes (Many)
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: '600', marginBottom: '8px', color: '#c3c9d7' }}>Can one **{rel.entity2}** have multiple **{pluralize(rel.entity1)}**?</p>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                                <button onClick={() => dispatch({ type: 'UPDATE_RELATIONSHIP', payload: { index, key: 'entity2HasMany', value: false } })}
                                                    style={{
                                                        ...buttonStyle, padding: '12px 20px', border: `2px solid ${rel.entity2HasMany === false ? SUCCESS : BORDER}`,
                                                        backgroundColor: rel.entity2HasMany === false ? SUCCESS : SURFACE, color: 'white'
                                                    }}>
                                                    No (One)
                                                </button>
                                                <button onClick={() => dispatch({ type: 'UPDATE_RELATIONSHIP', payload: { index, key: 'entity2HasMany', value: true } })}
                                                    style={{
                                                        ...buttonStyle, padding: '12px 20px', border: `2px solid ${rel.entity2HasMany === true ? SUCCESS : BORDER}`,
                                                        backgroundColor: rel.entity2HasMany === true ? SUCCESS : SURFACE, color: 'white'
                                                    }}>
                                                    Yes (Many)
                                                </button>
                                            </div>
                                        </div>
                                        <div style={{ paddingTop: '10px', color: '#94a3b8', fontSize: '0.875rem' }}>
                                            {rel.entity1HasMany === false && rel.entity2HasMany === false && <p>Result: One-to-One relationship.</p>}
                                            {rel.entity1HasMany === true && rel.entity2HasMany === false && <p>Result: One-to-Many relationship (from **{rel.entity1}** to **{rel.entity2}**).</p>}
                                            {rel.entity1HasMany === false && rel.entity2HasMany === true && <p>Result: Many-to-One relationship (from **{rel.entity1}** to **{rel.entity2}**).</p>}
                                            {rel.entity1HasMany === true && rel.entity2HasMany === true && <p>Result: Many-to-Many relationship (requires bridge table).</p>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <button onClick={() => dispatch({ type: 'SET_STEP', payload: 2 })}
                                    style={{ ...buttonStyle, backgroundColor: BORDER, color: TEXT, border: `1px solid ${BORDER}` }}>
                                    ← Back
                                </button>
                                <button onClick={handleGenerateCode} disabled={relationships.some(r => r.entity1HasMany === null || r.entity2HasMany === null)}
                                    style={{
                                        ...buttonStyle, flex: 1, backgroundColor: PRIMARY, color: 'white',
                                        opacity: relationships.some(r => r.entity1HasMany === null || r.entity2HasMany === null) ? 0.5 : 1,
                                        pointerEvents: relationships.some(r => r.entity1HasMany === null || r.entity2HasMany === null) ? 'none' : 'auto'
                                    }}>
                                    Generate Code →
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: SUCCESS }}>
                                <Code style={{ width: '32px', height: '32px', color: SUCCESS }} />
                                Your Backend is Ready! 🥳
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                                {/* MODELS.PY */}
                                <div style={{ backgroundColor: BG, padding: '24px', borderRadius: '12px', maxHeight: '400px', overflowY: 'auto', border: `1px solid ${SUCCESS}` }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', position: 'sticky', top: 0, backgroundColor: BG, paddingBottom: '8px' }}>
                                        <h3 style={{ color: SUCCESS, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>app/models.py (SQLAlchemy)</h3>
                                        <button
                                            onClick={() => copyToClipboard(generatedCode.models, 'models')}
                                            style={{
                                                ...buttonStyle, padding: '8px 16px', fontSize: '0.75rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px',
                                                backgroundColor: copiedCode === 'models' ? SUCCESS : BORDER,
                                                color: 'white'
                                            }}>
                                            {copiedCode === 'models' ? <><Clipboard style={{ width: '16px', height: '16px' }} /> Copied!</> : <><Clipboard style={{ width: '16px', height: '16px' }} /> Copy Code</>}
                                        </button>
                                    </div>
                                    <pre style={{ fontSize: '0.875rem', color: '#c1f1c1', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>{generatedCode.models}</pre>
                                </div>

                                {/* SCHEMAS.PY */}
                                <div style={{ backgroundColor: BG, padding: '24px', borderRadius: '12px', maxHeight: '400px', overflowY: 'auto', border: `1px solid ${PRIMARY}` }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', position: 'sticky', top: 0, backgroundColor: BG, paddingBottom: '8px' }}>
                                        <h3 style={{ color: PRIMARY, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>app/schemas.py (Marshmallow)</h3>
                                        <button
                                            onClick={() => copyToClipboard(generatedCode.schemas, 'schemas')}
                                            style={{
                                                ...buttonStyle, padding: '8px 16px', fontSize: '0.75rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px',
                                                backgroundColor: copiedCode === 'schemas' ? SUCCESS : BORDER,
                                                color: 'white'
                                            }}>
                                            {copiedCode === 'schemas' ? <><Clipboard style={{ width: '16px', height: '16px' }} /> Copied!</> : <><Clipboard style={{ width: '16px', height: '16px' }} /> Copy Code</>}
                                        </button>
                                    </div>
                                    <pre style={{ fontSize: '0.875rem', color: '#88d7ff', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>{generatedCode.schemas}</pre>
                                </div>

                                {/* ROUTES.PY */}
                                <div style={{ backgroundColor: BG, padding: '24px', borderRadius: '12px', maxHeight: '400px', overflowY: 'auto', border: `1px solid ${ACCENT}` }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', position: 'sticky', top: 0, backgroundColor: BG, paddingBottom: '8px' }}>
                                        <h3 style={{ color: ACCENT, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>app/routes.py (Flask Blueprint)</h3>
                                        <button
                                            onClick={() => copyToClipboard(generatedCode.routes, 'routes')}
                                            style={{
                                                ...buttonStyle, padding: '8px 16px', fontSize: '0.75rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px',
                                                backgroundColor: copiedCode === 'routes' ? SUCCESS : BORDER,
                                                color: 'white'
                                            }}>
                                            {copiedCode === 'routes' ? <><Clipboard style={{ width: '16px', height: '16px' }} /> Copied!</> : <><Clipboard style={{ width: '16px', height: '16px' }} /> Copy Code</>}
                                        </button>
                                    </div>
                                    <pre style={{ fontSize: '0.875rem', color: '#ff88ff', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>{generatedCode.routes}</pre>
                                </div>
                            </div>

                            <div style={{ backgroundColor: BORDER, border: `1px solid ${PRIMARY}`, borderRadius: '12px', padding: '24px', marginTop: '32px' }}>
                                <h3 style={{ fontWeight: 'bold', color: PRIMARY, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Route style={{ width: '20px', height: '20px' }} /> Next Steps to Deploy:</h3>
                                <ol style={{ listStyle: 'decimal', paddingLeft: '24px', color: '#c3c9d7', lineHeight: '1.6' }}>
                                    <li>Place **models.py**, **schemas.py**, and **routes.py** in your **app/** directory.</li>
                                    <li>Ensure you have a basic **run.py** and **extensions.py** file set up.</li>
                                    <li>Run database initialization (**python init\_db.py** or similar).</li>
                                    <li>Start the server (**python run.py**).</li>
                                    <li>Test your API health endpoint: **curl http://localhost:5555/api/health**</li>
                                </ol>
                            </div>

                            <button onClick={() => dispatch({ type: 'RESET' })}
                                style={{ ...buttonStyle, backgroundColor: PRIMARY, color: 'white', width: '100%', padding: '20px', fontSize: '18px', marginTop: '24px' }}>
                                Create Another Backend
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}