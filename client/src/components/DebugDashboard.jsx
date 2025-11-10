import { useApp } from "../hooks/useApp";
import { useEffect, useState, useRef } from "react";

export function DebugDashboard() {
    const { loading, userInfo, userCategories, allCategories } = useApp();
    const [logs, setLogs] = useState([]);
    const startTime = useRef(performance.now());

    const addLog = (event, value) => {
        const timestamp = performance.now() - startTime.current;
        setLogs(prev => [...prev, {
            ms: timestamp.toFixed(2),
            event,
            value
        }]);
    };

    useEffect(() => {
        addLog('🚀 Component Mounted', 'DebugDashboard initialized');
    }, []);

    useEffect(() => {
        addLog('🔄 loading', loading);
    }, [loading]);

    useEffect(() => {
        addLog('👤 userInfo', userInfo ? `${userInfo.name} (id: ${userInfo.id})` : 'null');
    }, [userInfo]);

    useEffect(() => {
        addLog('📁 userCategories', `${userCategories.length} categories, ${userCategories.flatMap(c => c.products).length} products`);
    }, [userCategories]);

    useEffect(() => {
        addLog('🗂️ allCategories', `${allCategories.length} categories`);
    }, [allCategories]);

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            right: 0,
            width: '500px',
            maxHeight: '60vh',
            overflow: 'auto',
            backgroundColor: '#0f172a',
            border: '2px solid #10b981',
            padding: '1rem',
            fontSize: '0.75rem',
            fontFamily: 'Monaco, Consolas, monospace',
            zIndex: 9999
        }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1rem',
                borderBottom: '1px solid #334155',
                paddingBottom: '0.5rem'
            }}>
                <h3 style={{ margin: 0, color: '#10b981' }}>
                    ⚡ Performance Timeline
                </h3>
                <button 
                    onClick={() => {
                        setLogs([]);
                        startTime.current = performance.now();
                        addLog('🔄 Reset', 'Timeline cleared');
                    }}
                    style={{
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.7rem',
                        background: '#ef4444',
                        border: 'none',
                        borderRadius: '4px',
                        color: 'white',
                        cursor: 'pointer'
                    }}
                >
                    Clear
                </button>
            </div>
            
            <div style={{ 
                marginBottom: '1rem', 
                padding: '0.75rem', 
                backgroundColor: '#1e293b', 
                borderRadius: '4px',
                border: '1px solid #334155'
            }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>
                        <span style={{ color: '#94a3b8' }}>Loading:</span>
                        <strong style={{ marginLeft: '0.5rem', color: loading ? '#f59e0b' : '#10b981' }}>
                            {loading ? '🔄 TRUE' : '✅ FALSE'}
                        </strong>
                    </div>
                    <div>
                        <span style={{ color: '#94a3b8' }}>UserInfo:</span>
                        <strong style={{ marginLeft: '0.5rem', color: userInfo ? '#10b981' : '#ef4444' }}>
                            {userInfo ? `✅ ${userInfo.name}` : '❌ NULL'}
                        </strong>
                    </div>
                    <div>
                        <span style={{ color: '#94a3b8' }}>UserCategories:</span>
                        <strong style={{ marginLeft: '0.5rem', color: '#0ea5e9' }}>
                            {userCategories.length}
                        </strong>
                    </div>
                    <div>
                        <span style={{ color: '#94a3b8' }}>AllCategories:</span>
                        <strong style={{ marginLeft: '0.5rem', color: '#0ea5e9' }}>
                            {allCategories.length}
                        </strong>
                    </div>
                </div>
            </div>

            <h4 style={{ color: '#10b981', margin: '0 0 0.5rem 0', fontSize: '0.8rem' }}>
                Timeline (milliseconds since mount):
            </h4>
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column-reverse',
                gap: '0.25rem'
            }}>
                {logs.map((log, index) => {
                    const prevMs = index > 0 ? parseFloat(logs[index - 1].ms) : 0;
                    const currentMs = parseFloat(log.ms);
                    const delta = index > 0 ? (currentMs - prevMs).toFixed(2) : '0.00';
                    
                    return (
                        <div key={index} style={{
                            padding: '0.5rem',
                            backgroundColor: '#1e293b',
                            borderRadius: '4px',
                            borderLeft: '3px solid #10b981',
                            display: 'grid',
                            gridTemplateColumns: '80px 1fr 60px',
                            gap: '0.5rem',
                            alignItems: 'center'
                        }}>
                            <div style={{ 
                                color: '#10b981', 
                                fontWeight: 'bold',
                                fontVariantNumeric: 'tabular-nums'
                            }}>
                                {log.ms}ms
                            </div>
                            <div>
                                <div style={{ color: '#0ea5e9', fontWeight: 'bold' }}>
                                    {log.event}
                                </div>
                                <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>
                                    {typeof log.value === 'object' ? JSON.stringify(log.value) : log.value}
                                </div>
                            </div>
                            <div style={{ 
                                color: '#f59e0b', 
                                fontSize: '0.7rem',
                                textAlign: 'right',
                                fontVariantNumeric: 'tabular-nums'
                            }}>
                                +{delta}ms
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}