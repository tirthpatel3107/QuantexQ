import React from "react";
import ReactECharts from "echarts-for-react";
import { PanelCard } from "@/components/dashboard/PanelCard";

interface LiveSensorStripProps {
  title?: string;
  sensorValue?: string;
  unit?: string;
  depth?: string;
  className?: string;
}

/**
 * LiveSensorStrip Component
 * 
 * A specialized horizontal strip chart mimic from the provided design.
 */
export function LiveSensorStrip({
  title = "Temp",
  sensorValue: initialValue = "85",
  unit = "°F",
  depth = "61,40",
  className
}: LiveSensorStripProps) {
  const [data, setData] = React.useState(() => 
    Array.from({ length: 120 }).map(() => 20 + Math.random() * 40)
  );
  const [val, setVal] = React.useState(parseFloat(initialValue));

  // Simulate real-time updates
  React.useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1)];
        newData.push(20 + Math.random() * 40);
        return newData;
      });
      setVal(v => v + (Math.random() - 0.5));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const option = {
    animation: false,
    grid: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    xAxis: {
      type: 'category',
      show: false,
    },
    yAxis: {
      type: 'value',
      show: false,
      min: 0,
      max: 100,
    },
    series: [
      {
        type: 'bar',
        barWidth: '70%',
        itemStyle: {
          color: 'rgba(255, 255, 255, 0.4)',
        },
        data: data,
      }
    ],
  };

  return (
    <PanelCard 
      title="Live Sensor Data"
      className={className}
      contentClassName="p-0"
    >
      <div className="relative h-20 w-full bg-[#202125] rounded overflow-hidden flex flex-col font-sans">
        {/* Background Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none" 
             style={{ 
               backgroundImage: 'radial-gradient(circle, #fff 0.5px, transparent 0.5px)', 
               backgroundSize: '4px 4px' 
             }} 
        />

        {/* Header text */}
        <div className="px-2 pt-1">
          <span className="text-sm italic text-[#7b7e84]">
            Dear TO connected. erser:
          </span>
        </div>

        <div className="flex-1 flex px-2 items-start gap-3">
          {/* Left Stats Column */}
          <div className="w-[180px] flex flex-col gap-1.5 py-1">
            {/* Row 1: Temp */}
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#7b7e84]" />
              <div className="flex items-center gap-2 flex-1">
                 <span className="text-[11px] text-[#dbdcde]">60</span>
                 <span className="text-[11px] text-[#dbdcde]">{title}:</span>
                 <div className="bg-[#2a2d35] px-2 py-0.5 rounded border border-white/5 flex items-baseline gap-1 shadow-[0_0_8px_rgba(255,255,255,0.05)]">
                    <span className="text-sm font-bold text-white tabular-nums tracking-wide">{val.toFixed(0)}</span>
                    <span className="text-sm text-[#dbdcde]">{unit}</span>
                 </div>
              </div>
            </div>
            
            {/* Row 2: Depth */}
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#7b7e84]" />
              <div className="flex items-center gap-2 flex-1">
                 <span className="text-[11px] text-[#dbdcde] tracking-tighter uppercase font-medium">Depth:</span>
                 <div className="flex items-baseline gap-1.5 pl-2 pr-1.5 py-0.5 bg-[#1a1c1e] rounded shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] border border-white/5">
                    <span className="text-[#a8d3a0] font-mono text-[13px] font-bold">
                      {depth}
                    </span>
                    <span className="text-sm text-[#dbdcde]">ft</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Right Chart Area */}
          <div className="flex-1 h-full relative border-l border-white/10 pl-2">
             {/* Vertical Grid Background lines */}
             <div className="absolute inset-0 flex justify-between px-1 opacity-[0.1]">
               {Array.from({ length: 60 }).map((_, i) => (
                  <div key={i} className="w-[1px] h-full bg-white" />
               ))}
             </div>

             <div className="h-[40px] mt-1 relative z-10">
                <ReactECharts 
                  option={option} 
                  style={{ height: '100%', width: '100%' }}
                  opts={{ renderer: 'canvas' }}
                />
             </div>
             
             {/* Mimicked specific weird time labels from mockup */}
             <div className="absolute bottom-1 left-2 right-2 flex justify-between text-[8px] text-[#7b7e84] font-mono tracking-tighter uppercase select-none z-20">
               <span>0</span>
               <span>10:00</span>
               <span>20:00</span>
               <span>20:00</span>
               <span>40:00</span>
               <span>50:00</span>
               <span>40:00</span>
               <span>90:00</span>
               <span>80:00</span>
               <span>60:00</span>
               <span>70:00</span>
               <span>80:00</span>
               <span>76:00</span>
             </div>
          </div>
        </div>
      </div>
    </PanelCard>
  );
}
