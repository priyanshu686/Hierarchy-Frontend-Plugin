"use client";
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, User } from "lucide-react";

export interface HierarchyNode {
  user_Id: number;
  prev_Id?: number | null;
  next_Id?: number[];
}

interface HierarchyTreeProps {
  data: HierarchyNode[];
}

// Build tree structure
const buildTree = (nodes: HierarchyNode[] = []) => { // default to empty array
  if (!Array.isArray(nodes)) {
    console.warn("buildTree: nodes is not an array", nodes);
    nodes = [];
  }

  const nodeMap: Record<number, HierarchyNode & { children: HierarchyNode[]; parent?: number }> = {};
  const roots: (HierarchyNode & { children: HierarchyNode[] })[] = [];

  nodes.forEach((node) => {
    nodeMap[node.user_Id] = { ...node, children: [] };
  });

  nodes.forEach((node) => {
    if (node.next_Id) {
      node.next_Id.forEach((childId) => {
        const child = nodeMap[childId];
        if (child) {
          nodeMap[node.user_Id].children.push(child);
          child.parent = node.user_Id;
        }
      });
    }
    if (!node.prev_Id) {
      roots.push(nodeMap[node.user_Id]);
    }
  });

  return roots;
};


// Tree Node Component
interface TreeNodeComponentProps {
  node: HierarchyNode & { children: HierarchyNode[] };
  depth: number;
  isLast: boolean;
  prefix: string[];
}

const TreeNodeComponent: React.FC<TreeNodeComponentProps> = ({
  node,
  depth,
  isLast,
  prefix,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children.length > 0;

  return (
    <div className="select-none">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: depth * 0.05 }}
        className="flex items-center gap-1 hover:bg-gray-50 rounded-md px-1 py-0.5 -ml-1 transition-colors"
        style={{ paddingLeft: `${depth * 20}px` }}
      >
        {/* Connector Lines */}
        <div className="flex items-center">
          {prefix.map((segment, i) => (
            <div
              key={i}
              className={`w-5 h-full border-l-2 ${
                segment === "│" ? "border-gray-300" : "border-transparent"
              }`}
            />
          ))}
          <div
            className={`w-5 h-full border-b-2 ${
              isLast ? "border-transparent" : "border-gray-300"
            }`}
          />
        </div>

        {/* Expand/Collapse Toggle */}
        {hasChildren ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-0.5 rounded hover:bg-gray-200 transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            )}
          </button>
        ) : (
          <div className="w-5" />
        )}

        {/* Node Icon & Label */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
            {node.user_Id}
          </div>
          <span className="text-sm font-medium text-gray-800">User {node.user_Id}</span>
        </div>
      </motion.div>

      {/* Children */}
      <AnimatePresence initial={false}>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {node.children.map((child, index) => {
              const childPrefix = [...prefix];
              if (!isLast) childPrefix.push("│");
              else childPrefix.push(" ");
              const isChildLast = index === node.children.length - 1;

              return (
                <TreeNodeComponent
                  key={child.user_Id}
                  node={child as HierarchyNode & { children: HierarchyNode[] }}
                  depth={depth + 1}
                  isLast={isChildLast}
                  prefix={childPrefix}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const HierarchyTree: React.FC<HierarchyTreeProps> = ({ data }) => {
  const treeData = useMemo(() => buildTree(data), [data]);

  if (!treeData.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>No hierarchy found</p>
      </div>
    );
  }

  return (
    <div className="font-mono bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <User className="w-5 h-5 text-indigo-600" />
        User Hierarchy Tree
      </h2>
      <div className="space-y-1">
        {treeData.map((root, index) => (
          <TreeNodeComponent
            key={root.user_Id}
            node={root}
            depth={0}
            isLast={index === treeData.length - 1}
            prefix={[]}
          />
        ))}
      </div>
    </div>
  );
};  
