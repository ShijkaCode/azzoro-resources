import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { MapPin } from 'lucide-react';

const ageData = [
  { name: '20-30', value: 35, color: 'hsl(75, 100%, 55%)' },
  { name: '30-40', value: 40, color: 'hsl(75, 100%, 45%)' },
  { name: '40-50', value: 18, color: 'hsl(220, 60%, 20%)' },
  { name: '50+', value: 7, color: 'hsl(220, 60%, 30%)' },
];

const stats = [
  { value: 419, suffix: '+', label: 'Engineers' },
  { value: 6.4, suffix: 'M+', label: 'Man-hours', isDecimal: true },
  { value: 155, suffix: '+', label: 'Projects Delivered' },
  { value: 25, suffix: '', label: 'Years of Excellence' },
];

const locationMarkers = [
  { top: '25%', left: '30%', label: 'Ulaanbaatar' },
  { top: '35%', left: '55%', label: 'Darkhan' },
  { top: '60%', left: '40%', label: 'Gobi' },
  { top: '45%', left: '70%', label: 'East Region' },
];

const CountUp = ({ end, suffix = '', isDecimal = false }: { end: number; suffix?: string; isDecimal?: boolean }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    const increment = end / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isInView, end]);

  return (
    <span ref={ref}>
      {isDecimal ? count.toFixed(1) : Math.floor(count)}
      {suffix}
    </span>
  );
};

const StatisticsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 md:py-32 bg-background">
      <div className="container-wide">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">By the Numbers</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">Current Statistics</h2>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Donut Chart */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card rounded-3xl border border-border p-8"
          >
            <h3 className="text-lg font-semibold text-foreground mb-6">Employee Age Groups</h3>
            
            <div className="h-64 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                    animationBegin={200}
                    animationDuration={1000}
                  >
                    {ageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              
              {/* Center Label */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">419</div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
              </div>
            </div>
            
            {/* Legend */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              {ageData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Statistics Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="bg-card rounded-2xl border border-border p-6 flex flex-col justify-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  <CountUp end={stat.value} suffix={stat.suffix} isDecimal={stat.isDecimal} />
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Mongolia Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-card rounded-3xl border border-border p-8"
          >
            <h3 className="text-lg font-semibold text-foreground mb-6">Project Locations</h3>
            
            {/* Simplified Map */}
            <div className="relative h-64 bg-secondary/50 rounded-2xl overflow-hidden">
              {/* Map Shape (simplified Mongolia outline) */}
              <svg 
                viewBox="0 0 200 100" 
                className="w-full h-full"
                preserveAspectRatio="xMidYMid meet"
              >
                <path
                  d="M20,30 L40,20 L80,25 L120,15 L160,25 L180,35 L175,50 L165,60 L140,65 L100,70 L60,75 L30,65 L25,50 Z"
                  fill="hsl(var(--muted))"
                  stroke="hsl(var(--border))"
                  strokeWidth="1"
                />
              </svg>
              
              {/* Location Markers */}
              {locationMarkers.map((marker, index) => (
                <motion.div
                  key={marker.label}
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.15 }}
                  className="absolute group cursor-pointer"
                  style={{ top: marker.top, left: marker.left }}
                >
                  <div className="relative">
                    <div className="w-4 h-4 bg-primary rounded-full animate-pulse" />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-navy-dark text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      {marker.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Regions List */}
            <div className="flex flex-wrap gap-2 mt-6">
              {locationMarkers.map((marker) => (
                <span 
                  key={marker.label}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-sm text-muted-foreground"
                >
                  <MapPin className="w-3 h-3" />
                  {marker.label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
