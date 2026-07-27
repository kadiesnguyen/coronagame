import { Box, Typography } from "@mui/material";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const ChartTooltip = ({ active, payload, label, valueFormatter }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <Box
      sx={{
        background: "#0b1528",
        border: "1px solid rgba(212,175,55,.45)",
        borderRadius: "12px",
        padding: "10px 12px",
        boxShadow: "0 8px 24px rgba(0,0,0,.45)",
        minWidth: 140,
      }}
    >
      <Typography sx={{ fontSize: "1.2rem", color: "#8b95a8", mb: "4px" }}>{label}</Typography>
      <Typography sx={{ fontSize: "1.5rem", fontWeight: 700, color: "#e5c05b" }}>
        {valueFormatter ? valueFormatter(item.value) : item.value}
      </Typography>
      <Typography sx={{ fontSize: "1.2rem", color: "#b8c0d4" }}>{item.name}</Typography>
    </Box>
  );
};

const abbreviate = (n) => {
  const v = Number(n) || 0;
  if (Math.abs(v) >= 1e9) return `${(v / 1e9).toFixed(1)}B`;
  if (Math.abs(v) >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
  if (Math.abs(v) >= 1e3) return `${(v / 1e3).toFixed(1)}K`;
  return String(v);
};

/**
 * Dark/gold admin chart card — area + bar composed, axes, grid, KPI strip.
 */
const DashboardChartCard = ({
  title,
  subtitle,
  totalLabel,
  totalValue,
  data = [],
  dataKey = "value",
  seriesName = "Giá trị",
  accent = "#d4af37",
  accentSoft = "rgba(212,175,55,.35)",
  valueFormatter,
  yTickFormatter,
  Icon,
}) => {
  const series = Array.isArray(data) ? data : [];
  const values = series.map((d) => Number(d[dataKey]) || 0);
  const sum = values.reduce((a, b) => a + b, 0);
  const avg = values.length ? Math.round(sum / values.length) : 0;
  const peak = values.length ? Math.max(...values) : 0;
  const last = values.length ? values[values.length - 1] : 0;
  const prev = values.length > 1 ? values[values.length - 2] : last;
  const delta = last - prev;
  const deltaPct = prev ? ((delta / prev) * 100).toFixed(1) : "0.0";
  const up = delta >= 0;
  const gradId = `grad-${String(title).replace(/\s+/g, "-").toLowerCase()}`;

  const fmt = valueFormatter || ((v) => String(v ?? 0));
  const yFmt = yTickFormatter || abbreviate;

  return (
    <Box
      sx={{
        height: "100%",
        minHeight: 320,
        backgroundColor: "#162948",
        border: "1px solid rgba(212,175,55,.25)",
        borderRadius: "16px",
        padding: { xs: "14px", md: "18px" },
        boxShadow: "0 8px 24px rgba(0,0,0,.25)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        color: "#fff",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: "1.35rem", color: "#8b95a8", fontWeight: 600 }}>{title}</Typography>
          <Typography
            sx={{
              fontSize: { xs: "2rem", md: "2.3rem" },
              fontWeight: 800,
              color: accent,
              lineHeight: 1.2,
              mt: "4px",
            }}
          >
            {totalValue}
          </Typography>
          <Typography sx={{ fontSize: "1.2rem", color: "#b8c0d4", mt: "2px" }}>{totalLabel || subtitle}</Typography>
        </Box>
        {Icon ? (
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "12px",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `radial-gradient(circle at 30% 30%, ${accentSoft}, transparent 70%), #101d33`,
              border: `1px solid ${accent}66`,
              color: accent,
            }}
          >
            <Icon sx={{ fontSize: 24 }} />
          </Box>
        ) : null}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "8px",
        }}
      >
        {[
          { label: "Trung bình/ngày", value: fmt(avg) },
          { label: "Đỉnh", value: fmt(peak) },
          {
            label: "Vs hôm trước",
            value: `${up ? "+" : ""}${deltaPct}%`,
            color: up ? "#1fc67c" : "#ef6d6d",
          },
        ].map((stat) => (
          <Box
            key={stat.label}
            sx={{
              p: "8px 10px",
              borderRadius: "10px",
              backgroundColor: "#101d33",
              border: "1px solid rgba(255,255,255,.06)",
              minWidth: 0,
            }}
          >
            <Typography
              sx={{
                fontSize: "1.05rem",
                color: "#8b95a8",
                lineHeight: 1.2,
              }}
            >
              {stat.label}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "1.2rem", sm: "1.35rem" },
                fontWeight: 700,
                color: stat.color || "#fff",
                mt: "2px",
                lineHeight: 1.25,
                wordBreak: "break-word",
              }}
            >
              {stat.value}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ width: "100%", height: 200, mt: "4px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={series} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accent} stopOpacity={0.45} />
                <stop offset="100%" stopColor={accent} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,.06)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: "#8b95a8", fontSize: 11 }}
              axisLine={{ stroke: "rgba(255,255,255,.08)" }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: "#8b95a8", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={58}
              tickFormatter={yFmt}
            />
            <Tooltip content={<ChartTooltip valueFormatter={fmt} />} cursor={{ stroke: accentSoft, strokeWidth: 1 }} />
            <Bar dataKey={dataKey} name={seriesName} fill={accentSoft} radius={[4, 4, 0, 0]} barSize={14} />
            <Area
              type="monotone"
              dataKey={dataKey}
              name={seriesName}
              stroke={accent}
              strokeWidth={2.5}
              fill={`url(#${gradId})`}
              dot={{ r: 3, fill: accent, stroke: "#0b1528", strokeWidth: 2 }}
              activeDot={{ r: 5, fill: "#e5c05b", stroke: "#0b1528", strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default DashboardChartCard;
