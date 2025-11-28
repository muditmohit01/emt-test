import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "wouter";
import { ChevronLeft, Activity } from "lucide-react";

interface AssessmentItem {
  description: string;
  score: number;
}

interface VitalSignCategory {
  id: string;
  name: string;
  score: number;
  items: AssessmentItem[];
}

export default function VitalSigns() {
  const [data, setData] = useState<VitalSignCategory[]>([]);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/assessment-data.json")
      .then((res) => res.json())
      .then((json) => {
        setData(json.vital_signs);
        // Load from localStorage or initialize
        const savedCheckedItems = localStorage.getItem("assessmentCheckedItems");
        const initial: Record<string, boolean[]> = savedCheckedItems ? JSON.parse(savedCheckedItems) : {};
        
        // Ensure all categories exist
        json.vital_signs.forEach((category: VitalSignCategory) => {
          if (!initial[category.id]) {
            initial[category.id] = new Array(category.items.length).fill(false);
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

  const toggleItem = (categoryId: string, itemIndex: number) => {
    setCheckedItems((prev) => {
      const updated = {
        ...prev,
        [categoryId]: prev[categoryId].map((checked, idx) =>
          idx === itemIndex ? !checked : checked
        ),
      };
      // Save to localStorage
      localStorage.setItem("assessmentCheckedItems", JSON.stringify(updated));
      return updated;
    });
  };

  const getCategoryProgress = (categoryId: string) => {
    const checked = checkedItems[categoryId]?.filter(Boolean).length || 0;
    const total = checkedItems[categoryId]?.length || 0;
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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment data...</p>
        </div>
      </div>
    );
  }

  const { checked: totalChecked, total: totalItems } = getTotalProgress();
  const progressPercent = totalItems > 0 ? (totalChecked / totalItems) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b border-blue-100 bg-white shadow-sm sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ChevronLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-blue-900">Vital Signs Assessment</h1>
            </div>
            <div className="w-24"></div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Overall Progress</span>
              <span className="font-semibold text-blue-600">{totalChecked}/{totalItems}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="grid gap-8">
          {data.map((category) => {
            const { checked, total } = getCategoryProgress(category.id);
            const categoryProgress = total > 0 ? (checked / total) * 100 : 0;

            return (
              <Card key={category.id} className="border-blue-200 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-25 border-b border-blue-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl text-blue-900">{category.name}</CardTitle>
                      <CardDescription>
                        {checked}/{total} items completed • {category.score} points
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{Math.round(categoryProgress)}%</div>
                      <div className="text-xs text-gray-600">Complete</div>
                    </div>
                  </div>
                  
                  {/* Category Progress Bar */}
                  <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${categoryProgress}%` }}
                    ></div>
                  </div>
                </CardHeader>

                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {category.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                      >
                        <Checkbox
                          id={`${category.id}-${idx}`}
                          checked={checkedItems[category.id]?.[idx] || false}
                          onCheckedChange={() => toggleItem(category.id, idx)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <label
                            htmlFor={`${category.id}-${idx}`}
                            className="text-gray-700 cursor-pointer font-medium"
                          >
                            {item.description}
                          </label>
                          <div className="text-xs text-gray-500 mt-1">Score: {item.score} point</div>
                        </div>
                        <div className="text-sm font-semibold text-blue-600 whitespace-nowrap">
                          {item.score} pt
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Summary Section */}
        <Card className="mt-12 bg-gradient-to-r from-blue-50 to-blue-25 border-blue-200">
          <CardHeader>
            <CardTitle>Assessment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-blue-600">{data.length}</div>
                <div className="text-gray-600">Total Categories</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">{totalItems}</div>
                <div className="text-gray-600">Total Assessment Items</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">{data.reduce((sum, cat) => sum + cat.score, 0)}</div>
                <div className="text-gray-600">Total Available Points</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8 justify-center flex-wrap">
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
          <Link href="/drugs">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Next: Medications & Fluids
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
