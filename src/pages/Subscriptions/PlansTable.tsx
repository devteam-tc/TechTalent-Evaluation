"use client";

import React from "react";
import { Pencil, Trash2, BookOpen, CheckSquare, Code } from "lucide-react";

type PlanItem = {
  id: number;
  name: string;
  planType: string;
  courseLimit: number;
  mcqCredits: number;
  codingCredits: number;
  amount: number;
  gst_percent?: number;
  description?: string;
  is_active?: boolean;
};

type Props = {
  plans: PlanItem[];
  onEdit: (plan: PlanItem) => void;
  onDelete: (id: number) => void;
};

const PlansTable: React.FC<Props> = ({ plans, onEdit, onDelete }) => {
  const calculateGST = (amount: number, gstPercent: number = 18) => {
    const total = amount + amount * (gstPercent / 100);
    return total.toFixed(2);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px]">
        {/* Header */}
        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-6 py-4 text-left">Plan Type</th>
            <th className="px-6 py-4 text-left">Plan Name</th>
            <th className="px-6 py-4 text-left">Course Limit</th>
            <th className="px-6 py-4 text-left">MCQ Credits</th>
            <th className="px-6 py-4 text-left">Coding Credits</th>
            <th className="px-6 py-4 text-left">Amount</th>
            <th className="px-6 py-4 text-left">Total (Incl. GST)</th>
            <th className="px-6 py-4 text-left">Actions</th>
          </tr>
        </thead>

        {/* Body */}
        <tbody className="text-sm text-gray-700">
          {plans.map((plan) => (
            <tr key={plan.id} className="border-t">
              {/* Plan Type */}
              <td className="px-6 py-5 font-medium">{plan.planType}</td>

              {/* Plan Name */}
              <td className="px-6 py-5">{plan.name}</td>

              {/* Course Limit */}
              <td className="px-6 py-5">
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-gray-400" />
                  {plan.courseLimit}
                </div>
              </td>

              {/* MCQ Credits */}
              <td className="px-6 py-5">
                <div className="flex items-center gap-2">
                  <CheckSquare size={16} className="text-blue-500" />
                  {plan.mcqCredits}
                </div>
              </td>

              {/* Coding Credits */}
              <td className="px-6 py-5">
                <div className="flex items-center gap-2">
                  <Code size={16} className="text-purple-500" />
                  {plan.codingCredits}
                </div>
              </td>

              {/* Amount */}
              <td className="px-6 py-5 font-semibold text-green-600">
                ₹ {plan.amount.toFixed(2)}
              </td>

              {/* Total with GST */}
              <td className="px-6 py-5">
                <div className="text-indigo-600 font-semibold">
                  ₹ {calculateGST(plan.amount, plan.gst_percent)}
                </div>
                <div className="text-xs text-gray-500">GST: {plan.gst_percent || 18}%</div>
              </td>

              {/* Actions */}
              <td className="px-6 py-5">
                <div className="flex gap-4">
                  <button
                    onClick={() => onEdit(plan)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(plan.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlansTable;
