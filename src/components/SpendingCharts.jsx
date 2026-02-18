import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"];

export default function SpendingCharts({ transactions, theme: t }) {
    const data = transactions.reduce((acc, txn) => {
        if (txn.type === "expense") {
            const existing = acc.find(item => item.name === txn.category);
            if (existing) existing.value += txn.amount;
            else acc.push({ name: txn.category, value: txn.amount });
        }
        return acc;
    }, []);

    // Sort by value descending
    data.sort((a, b) => b.value - a.value);

    return (
        <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "24px",
            animation: "fadeSlideIn 0.5s ease 0.5s both"
        }}>
            <style>{`
                @media (max-width: 768px) {
                    div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
                }
            `}</style>

            {/* Pie Chart Card */}
            <div style={{
                background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: "22px",
                padding: "24px", backdropFilter: "blur(12px)", minHeight: "350px", display: "flex", flexDirection: "column"
            }}>
                <div style={{ fontSize: "14px", fontWeight: "700", color: t.textSecondary, marginBottom: "20px", textTransform: "uppercase", letterSpacing: "1px" }}>
                    Spending by Category
                </div>
                <div style={{ flex: 1, width: "100%" }}>
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ background: t.navBg, border: `1px solid ${t.border}`, borderRadius: "10px", color: t.text }}
                                itemStyle={{ color: t.textSecondary }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bar Chart Card */}
            <div style={{
                background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: "22px",
                padding: "24px", backdropFilter: "blur(12px)", minHeight: "350px", display: "flex", flexDirection: "column"
            }}>
                <div style={{ fontSize: "14px", fontWeight: "700", color: t.textSecondary, marginBottom: "20px", textTransform: "uppercase", letterSpacing: "1px" }}>
                    Expense Distribution
                </div>
                <div style={{ flex: 1, width: "100%" }}>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={data.slice(0, 5)}>
                            <XAxis dataKey="name" stroke={t.textMuted} fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke={t.textMuted} fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip
                                cursor={{ fill: t.bgCardHover }}
                                contentStyle={{ background: t.navBg, border: `1px solid ${t.border}`, borderRadius: "10px", color: t.text }}
                            />
                            <Bar dataKey="value" fill="url(#barGradient)" radius={[6, 6, 0, 0]}>
                                {data.slice(0, 5).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} opacity={0.8} />
                                ))}
                            </Bar>
                            <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.2} />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
