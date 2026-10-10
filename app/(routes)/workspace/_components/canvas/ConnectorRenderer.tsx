"use client";

import React from "react";
import type { Connector } from "./types";

interface ConnectorRendererProps {
  connector: Connector;
  sourcePoint: { x: number; y: number };
  targetPoint: { x: number; y: number };
  isSelected: boolean;
  onSelect: (e: React.PointerEvent) => void;
}

export default function ConnectorRenderer({
  connector,
  sourcePoint,
  targetPoint,
  isSelected,
  onSelect,
}: ConnectorRendererProps) {
  const handleClick = (e: React.PointerEvent) => {
    e.stopPropagation();
    onSelect(e);
  };

  const x1 = sourcePoint?.x || 0;
  const y1 = sourcePoint?.y || 0;
  const x2 = targetPoint?.x || 0;
  const y2 = targetPoint?.y || 0;

  const strokeColor =
    connector.style?.stroke ||
    (connector.type === "main-function"
      ? isSelected ? "#a855f7" : "#c084fc"
      : connector.type === "main-output"
      ? isSelected ? "#22c55e" : "#4ade80"
      : isSelected ? "#38bdf8" : "#a855f7");

  const glowColor =
    connector.type === "main-function"
      ? "#c084fc"
      : connector.type === "main-output"
      ? "#4ade80"
      : isSelected
      ? "#38bdf8"
      : "#c084fc";

  const coreWidth = connector.style?.strokeWidth || (isSelected ? 3.5 : 2.75);
  const glowWidth = coreWidth + (isSelected ? 4 : 3);

  return (
    <g className="group cursor-pointer">
      {/* Invisible broad hitbox for easy clicking/hovering */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="transparent"
        strokeWidth={20}
        className="pointer-events-auto"
        onPointerDown={handleClick}
      />

      {/* Neon Glow Outer Layer */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={glowColor}
        strokeWidth={glowWidth}
        strokeLinecap="round"
        className="pointer-events-none opacity-50 blur-[2px] transition-all"
      />

      {/* Main Visible Neon Connector Line */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={strokeColor}
        strokeWidth={coreWidth}
        strokeLinecap="round"
        markerEnd={
          connector.type === "main-function"
            ? isSelected ? "url(#arrowhead-semantic-selected)" : "url(#arrowhead-semantic)"
            : connector.type === "main-output"
            ? isSelected ? "url(#arrowhead-output-selected)" : "url(#arrowhead-output)"
            : isSelected ? "url(#arrowhead-selected)" : "url(#arrowhead)"
        }
        className="pointer-events-none transition-colors"
      />

      {/* Semantic Connector Accent Track (Double line effect) */}
      {connector.type === "main-function" && (
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#fdf4ff"
          strokeWidth={1}
          strokeDasharray="4 4"
          strokeLinecap="round"
          className="pointer-events-none"
        />
      )}

      {/* Source Anchor Dot (Neon) */}
      <circle
        cx={x1}
        cy={y1}
        r={connector.type === "main-function" ? 4.5 : 3.5}
        fill={strokeColor}
        className="pointer-events-none"
      />
    </g>
  );
}
