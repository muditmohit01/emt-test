import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "wouter";
import { ChevronLeft, Pill } from "lucide-react";

interface CriterionItem {
  description: string;
  score: number;
}

interface DrugItem {
  id: string;
  name: string;
  score: number;
  criteria: CriterionItem[];
}

export default function Drugs() {
  const [data, setData] = useState<DrugItem[]>([]);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean[]>>({});
  const [loading, setLoading] = useState(true);
  const [expandedDrugs, setExpandedDrugs] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/assessment-data.json")
      .then((res) => res.json())
      .then((json) => {
        setData(json.drugs);
        // Load from localStorage or initialize
        const savedCheckedItems = localStorage.getItem("assessmentCheckedItems");
        const initial: Record<string, boolean[]> = savedCheckedItems ? JSON.parse(savedCheckedItems) : {};
        
        // Ensure all drugs exist
        json.drugs.forEach((drug: DrugItem) => {
          if (!initial[drug.id]) {
            initial[drug.id] = new Array(drug.criteria.length).fill(false);
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

  const toggleItem = (drugId: string, itemIndex: number) => {
    setCheckedItems((prev) => {
      const updated = {
        ...prev,
        [drugId]: prev[drugId].map((checked, idx) =>
          idx === itemIndex ? !checked : checked
        ),
      };
      // Save to localStorage
      localStorage.setItem("assessmentCheckedItems", JSON.stringify(updated));
      return updated;
    });
  };

  const toggleExpanded = (drugId: string) => {
    setExpandedDrugs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(drugId)) {
        newSet.delete(drugId);
      } else {
        newSet.add(drugId);
      }
      return newSet;
    });
  };

  const getDrugProgress = (drugId: string) => {
    const checked = checkedItems[drugId]?.filter(Boolean).length || 0;
    const total = checkedItems[drugId]?.length || 0;
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
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment data...</p>
        </div>
      </div>
    );
  }

  const { checked: totalChecked, total: totalItems } = getTotalProgress();
  const progressPercent = totalItems > 0 ? (totalChecked / totalItems) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="border-b border-green-100 bg-white shadow-sm sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ChevronLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Pill className="w-6 h-6 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-green-900">Medications & Fluids Assessment</h1>
            </div>
            <div className="w-24"></div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Overall Progress</span>
              <span className="font-semibold text-green-600">{totalChecked}/{totalItems}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="grid gap-4">
          {data.map((drug) => {
            const { checked, total } = getDrugProgress(drug.id);
            const drugProgress = total > 0 ? (checked / total) * 100 : 0;
            const isExpanded = expandedDrugs.has(drug.id);

            return (
              <Card key={drug.id} className="border-green-200 overflow-hidden">
                <button
                  onClick={() => toggleExpanded(drug.id)}
                  className="w-full text-left"
                >
                  <CardHeader className="bg-gradient-to-r from-green-50 to-green-25 border-b border-green-100 hover:from-green-100 hover:to-green-50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-green-900">{drug.name}</CardTitle>
                        <CardDescription>
                          {checked}/{total} criteria completed • {drug.score} points
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{Math.round(drugProgress)}%</div>
                        <div className="text-xs text-gray-600">Complete</div>
                      </div>
                    </div>
                    
                    {/* Drug Progress Bar */}
                    <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${drugProgress}%` }}
                      ></div>
                    </div>
                  </CardHeader>
                </button>

                {isExpanded && (
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      {drug.criteria.map((criterion, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-4 p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors"
                        >
                          <Checkbox
                            id={`${drug.id}-${idx}`}
                            checked={checkedItems[drug.id]?.[idx] || false}
                            onCheckedChange={() => toggleItem(drug.id, idx)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <label
                              htmlFor={`${drug.id}-${idx}`}
                              className="text-gray-700 cursor-pointer font-medium text-sm"
                            >
                              {criterion.description}
                            </label>
                          </div>
                          <div className="text-sm font-semibold text-green-600 whitespace-nowrap">
                            {criterion.score} pt
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
        <Card className="mt-12 bg-gradient-to-r from-green-50 to-green-25 border-green-200">
          <CardHeader>
            <CardTitle>Assessment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-green-600">{data.length}</div>
                <div className="text-gray-600">Total Medications & Fluids</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">{totalItems}</div>
                <div className="text-gray-600">Total Assessment Criteria</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">{data.reduce((sum, drug) => sum + drug.score, 0)}</div>
                <div className="text-gray-600">Total Available Points</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8 justify-center flex-wrap">
          <Link href="/vital-signs">
            <Button variant="outline">Previous: Vital Signs</Button>
          </Link>
          <Link href="/equipment">
            <Button className="bg-green-600 hover:bg-green-700">
              Next: Medical Equipment
            </Button>
          </Link>
          <Link href="/summary">
            <Button className="bg-purple-600 hover:bg-purple-700">
              View Summary
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
