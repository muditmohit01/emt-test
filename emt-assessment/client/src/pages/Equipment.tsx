import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "wouter";
import { ChevronLeft, Stethoscope } from "lucide-react";

interface ChecklistItem {
  description: string;
  score: number;
}

interface EquipmentItem {
  id: string;
  name: string;
  score: number;
  checklist: ChecklistItem[];
}

export default function Equipment() {
  const [data, setData] = useState<EquipmentItem[]>([]);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean[]>>({});
  const [loading, setLoading] = useState(true);
  const [expandedEquipment, setExpandedEquipment] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/assessment-data.json")
      .then((res) => res.json())
      .then((json) => {
        setData(json.equipment);
        // Load from localStorage or initialize
        const savedCheckedItems = localStorage.getItem("assessmentCheckedItems");
        const initial: Record<string, boolean[]> = savedCheckedItems ? JSON.parse(savedCheckedItems) : {};
        
        // Ensure all equipment exists
        json.equipment.forEach((equipment: EquipmentItem) => {
          if (!initial[equipment.id]) {
            initial[equipment.id] = new Array(equipment.checklist.length).fill(false);
          }
        });
        setCheckedItems(initial);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load assessment data:", err);
        setLoading(false);
      });
  }, []);

  const toggleItem = (equipmentId: string, itemIndex: number) => {
    setCheckedItems((prev) => {
      const updated = {
        ...prev,
        [equipmentId]: prev[equipmentId].map((checked, idx) =>
          idx === itemIndex ? !checked : checked
        ),
      };
      // Save to localStorage
      localStorage.setItem("assessmentCheckedItems", JSON.stringify(updated));
      return updated;
    });
  };

  const toggleExpanded = (equipmentId: string) => {
    setExpandedEquipment((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(equipmentId)) {
        newSet.delete(equipmentId);
      } else {
        newSet.add(equipmentId);
      }
      return newSet;
    });
  };

  const getEquipmentProgress = (equipmentId: string) => {
    const checked = checkedItems[equipmentId]?.filter(Boolean).length || 0;
    const total = checkedItems[equipmentId]?.length || 0;
    return { checked, total };
  };

  const getTotalProgress = () => {
    let totalChecked = 0;
    let totalItems = 0;
    Object.values(checkedItems).forEach((items) => {
      totalItems += items.length;
      totalChecked += items.filter(Boolean).length;
    });
    return { checked: totalChecked, total: totalItems };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment data...</p>
        </div>
      </div>
    );
  }

  const { checked: totalChecked, total: totalItems } = getTotalProgress();
  const progressPercent = totalItems > 0 ? (totalChecked / totalItems) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="border-b border-orange-100 bg-white shadow-sm sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ChevronLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-orange-600" />
              </div>
              <h1 className="text-2xl font-bold text-orange-900">Medical Equipment Assessment</h1>
            </div>
            <div className="w-24"></div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Overall Progress</span>
              <span className="font-semibold text-orange-600">{totalChecked}/{totalItems}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="grid gap-4">
          {data.map((equipment) => {
            const { checked, total } = getEquipmentProgress(equipment.id);
            const equipmentProgress = total > 0 ? (checked / total) * 100 : 0;
            const isExpanded = expandedEquipment.has(equipment.id);

            return (
              <Card key={equipment.id} className="border-orange-200 overflow-hidden">
                <button
                  onClick={() => toggleExpanded(equipment.id)}
                  className="w-full text-left"
                >
                  <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-25 border-b border-orange-100 hover:from-orange-100 hover:to-orange-50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-orange-900">{equipment.name}</CardTitle>
                        <CardDescription>
                          {checked}/{total} items completed • {equipment.score} points
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-orange-600">{Math.round(equipmentProgress)}%</div>
                        <div className="text-xs text-gray-600">Complete</div>
                      </div>
                    </div>
                    
                    {/* Equipment Progress Bar */}
                    <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${equipmentProgress}%` }}
                      ></div>
                    </div>
                  </CardHeader>
                </button>

                {isExpanded && (
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      {equipment.checklist.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-4 p-3 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors"
                        >
                          <Checkbox
                            id={`${equipment.id}-${idx}`}
                            checked={checkedItems[equipment.id]?.[idx] || false}
                            onCheckedChange={() => toggleItem(equipment.id, idx)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <label
                              htmlFor={`${equipment.id}-${idx}`}
                              className="text-gray-700 cursor-pointer font-medium text-sm"
                            >
                              {item.description}
                            </label>
                          </div>
                          <div className="text-sm font-semibold text-orange-600 whitespace-nowrap">
                            {item.score} pt
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* Summary Section */}
        <Card className="mt-12 bg-gradient-to-r from-orange-50 to-orange-25 border-orange-200">
          <CardHeader>
            <CardTitle>Assessment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-orange-600">{data.length}</div>
                <div className="text-gray-600">Total Equipment Items</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600">{totalItems}</div>
                <div className="text-gray-600">Total Checklist Items</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600">{data.reduce((sum, eq) => sum + eq.score, 0)}</div>
                <div className="text-gray-600">Total Available Points</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Completion Message */}
        {totalChecked === totalItems && totalItems > 0 && (
          <Card className="mt-8 bg-gradient-to-r from-green-50 to-green-25 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-900">🎉 Congratulations!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-800">
                You have completed the Medical Equipment Assessment. You have demonstrated comprehensive knowledge of all essential emergency medical equipment inspection and maintenance procedures.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8 justify-center flex-wrap">
          <Link href="/drugs">
            <Button variant="outline">Previous: Medications & Fluids</Button>
          </Link>
          <Link href="/summary">
            <Button className="bg-purple-600 hover:bg-purple-700">
              View Summary
            </Button>
          </Link>
          <Link href="/">
            <Button className="bg-orange-600 hover:bg-orange-700">
              Back to Home
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
