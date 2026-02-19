import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"];

export default function SpendingCharts({ transactions, theme: t }) {
    // 1. Data for Category Pie Chart
    const categoryData = transactions.reduce((acc, txn) => {
        if (txn.type === "expense") {
            const existing = acc.find(item => item.name === txn.category);
            if (existing) existing.value += txn.amount;
            else acc.push({ name: txn.category, value: txn.amount });
        }
        return acc;
    }, []);
    categoryData.sort((a, b) => b.value - a.value);

    // 2. Data for Income vs Expense
    const summary = transactions.reduce((acc, txn) => {
        if (txn.type === "income") acc.income += txn.amount;
        else acc.expense += txn.amount;
        return acc;
    }, { income: 0, expense: 0 });

    const summaryData = [
        { name: "Income", value: summary.income, fill: "#10b981" },
        { name: "Expense", value: summary.expense, fill: "#ef4444" }
    ];

    return (
        <>
            <style>{`
                .charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 24px; }
                @media (max-width: 768px) {
                    .charts-grid { grid-template-columns: 1fr !important; gap: 14px !important; }
                    .charts-grid-item { padding: 16px !important; border-radius: 16px !important; min-height: 280px !important; }
                }
            `}</style>

            <div className="charts-grid" style={{
                animation: "fadeSlideIn 0.5s ease 0.5s both"
            }}>

                {/* Income vs Expense Card */}
                <div className="charts-grid-item" style={{
                    background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: "22px",
                    padding: "24px", backdropFilter: "blur(12px)", minHeight: "350px", display: "flex", flexDirection: "column"
                }}>
                    <div style={{ fontSize: "14px", fontWeight: "700", color: t.textSecondary, marginBottom: "20px", textTransform: "uppercase", letterSpacing: "1px" }}>
                        Financial Balance
                    </div>
                    <div style={{ flex: 1, width: "100%" }}>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={summaryData}>
                                <XAxis dataKey="name" stroke={t.textMuted} fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke={t.textMuted} fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                                    contentStyle={{ background: t.navBg, border: `1px solid ${t.border}`, borderRadius: "10px", color: t.text }}
                                />
                                <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-around", marginTop: "15px", fontSize: "12px", fontWeight: "600" }}>
                        <div style={{ color: "#10b981" }}>Total In: ₹{summary.income.toLocaleString()}</div>
                        <div style={{ color: "#ef4444" }}>Total Out: ₹{summary.expense.toLocaleString()}</div>
                    </div>
                </div>

                {/* Pie Chart Card */}
                <div className="charts-grid-item" style={{
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
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
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
            </div>
        </>
    );
}
