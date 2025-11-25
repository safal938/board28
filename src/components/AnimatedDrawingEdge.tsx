import React, { useEffect, useRef } from 'react';
import { EdgeProps, getBezierPath, EdgeLabelRenderer } from 'reactflow';

export function AnimatedDrawingEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
  labelStyle,
  labelBgStyle,
  data,
}: EdgeProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const [showMarker, setShowMarker] = React.useState(false);
  const [hasAnimated, setHasAnimated] = React.useState(false);
  
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Get animation delay from data prop (default to 0)
  const animationDelay = (data?.animationDelay || 0) as number;
  const animationDuration = 0.8; // seconds

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    
    // If already animated, just show the final state
    if (hasAnimated) {
      path.style.strokeDasharray = '0';
      path.style.strokeDashoffset = '0';
      setShowMarker(true);
      return;
    }

    // Hide marker initially
    setShowMarker(false);

    // Get the total length of the path
    const length = path.getTotalLength();

    // Set up the stroke-dasharray and stroke-dashoffset for the drawing animation
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    // Trigger animation with delay
    const timeoutId = setTimeout(() => {
      if (path) {
        requestAnimationFrame(() => {
          path.style.transition = `stroke-dashoffset ${animationDuration}s ease-in-out`;
          path.style.strokeDashoffset = '0';
        });
      }
    }, animationDelay * 1000);

    // Show marker and mark as animated when animation completes
    const markerTimeoutId = setTimeout(() => {
      setShowMarker(true);
      setHasAnimated(true);
    }, (animationDelay + animationDuration) * 1000);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(markerTimeoutId);
    };
  }, [edgePath, hasAnimated, animationDelay, animationDuration]);

  return (
    <>
      <path
        ref={pathRef}
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        style={{
          ...style,
          strokeDasharray: 0,
          strokeDashoffset: 0,
          zIndex: 1,
        }}
        markerEnd={showMarker ? markerEnd : undefined}
      />
      {label && showMarker && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'none',
              backgroundColor: (labelBgStyle as any)?.fill || '#ffffff',
              opacity: (labelBgStyle as any)?.fillOpacity || 1,
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 600,
              color: (labelStyle as any)?.fill || '#000000',
              zIndex: 9999,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              isolation: 'isolate',
            }}
            className="react-flow__edge-label"
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) translate(${labelX}px, ${labelY}px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) translate(${labelX}px, ${labelY}px) scale(1);
          }
        }
      `}</style>
    </>
  );
}
