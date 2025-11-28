import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ChevronLeft, Award, TrendingUp, CheckCircle2, AlertCircle } from "lucide-react";

interface AssessmentData {
  vital_signs: Array<{ id: string; name: string; score: number; items: Array<{ score: number }> }>;
  drugs: Array<{ id: string; name: string; score: number; criteria: Array<{ score: number }> }>;
  equipment: Array<{ id: string; name: string; score: number; checklist: Array<{ score: number }> }>;
}

interface SectionScore {
  name: string;
  totalPoints: number;
  earnedPoints: number;
  percentage: number;
  competencyLevel: string;
  color: string;
  icon: React.ReactNode;
}

export default function Summary() {
  const [data, setData] = useState<AssessmentData | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean[]>>({});
  const [loading, setLoading] = useState(true);
  const [sectionScores, setSectionScores] = useState<Record<string, SectionScore>>({});

  useEffect(() => {
    // Load assessment data
    fetch("/assessment-data.json")
      .then((res) => res.json())
      .then((json) => {
        setData(json);

        // Load checked items from localStorage
        const savedCheckedItems = localStorage.getItem("assessmentCheckedItems");
        const checked = savedCheckedItems ? JSON.parse(savedCheckedItems) : {};

        // Initialize missing categories
        const initial: Record<string, boolean[]> = { ...checked };
        json.vital_signs.forEach((category: any) => {
          if (!initial[category.id]) {
            initial[category.id] = new Array(category.items.length).fill(false);
          }
        });
        json.drugs.forEach((drug: any) => {
          if (!initial[drug.id]) {
            initial[drug.id] = new Array(drug.criteria.length).fill(false);
          }
        });
        json.equipment.forEach((equipment: any) => {
          if (!initial[equipment.id]) {
            initial[equipment.id] = new Array(equipment.checklist.length).fill(false);
          }
        });

        setCheckedItems(initial);

        // Calculate scores
        const scores: Record<string, SectionScore> = {};

        // Vital Signs
        let vitalSignsEarned = 0;
        let vitalSignsTotal = 0;
        json.vital_signs.forEach((category: any) => {
          vitalSignsTotal += category.score;
          category.items.forEach((item: any, idx: number) => {
            if (initial[category.id]?.[idx]) {
              vitalSignsEarned += item.score;
            }
          });
        });
        const vitalSignsPercent = vitalSignsTotal > 0 ? (vitalSignsEarned / vitalSignsTotal) * 100 : 0;
        scores.vital_signs = {
          name: "Vital Signs Assessment",
          totalPoints: vitalSignsTotal,
          earnedPoints: vitalSignsEarned,
          percentage: vitalSignsPercent,
          competencyLevel: getCompetencyLevel(vitalSignsPercent),
          color: "blue",
          icon: <TrendingUp className="w-6 h-6" />,
        };

        // Drugs
        let drugsEarned = 0;
        let drugsTotal = 0;
        json.drugs.forEach((drug: any) => {
          drugsTotal += drug.score;
          drug.criteria.forEach((criterion: any, idx: number) => {
            if (initial[drug.id]?.[idx]) {
              drugsEarned += criterion.score;
            }
          });
        });
        const drugsPercent = drugsTotal > 0 ? (drugsEarned / drugsTotal) * 100 : 0;
        scores.drugs = {
          name: "Medications & Fluids Assessment",
          totalPoints: drugsTotal,
          earnedPoints: drugsEarned,
          percentage: drugsPercent,
          competencyLevel: getCompetencyLevel(drugsPercent),
          color: "green",
          icon: <CheckCircle2 className="w-6 h-6" />,
        };

        // Equipment
        let equipmentEarned = 0;
        let equipmentTotal = 0;
        json.equipment.forEach((equipment: any) => {
          equipmentTotal += equipment.score;
          equipment.checklist.forEach((item: any, idx: number) => {
            if (initial[equipment.id]?.[idx]) {
              equipmentEarned += item.score;
            }
          });
        });
        const equipmentPercent = equipmentTotal > 0 ? (equipmentEarned / equipmentTotal) * 100 : 0;
        scores.equipment = {
          name: "Medical Equipment Assessment",
          totalPoints: equipmentTotal,
          earnedPoints: equipmentEarned,
          percentage: equipmentPercent,
          competencyLevel: getCompetencyLevel(equipmentPercent),
          color: "orange",
          icon: <AlertCircle className="w-6 h-6" />,
        };

        setSectionScores(scores);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load assessment data:", err);
        setLoading(false);
      });
  }, []);

  const getCompetencyLevel = (percentage: number): string => {
    if (percentage >= 90) return "Expert";
    if (percentage >= 75) return "Advanced";
    if (percentage >= 60) return "Intermediate";
    if (percentage >= 40) return "Beginner";
    return "Needs Review";
  };

  const getCompetencyColor = (level: string): string => {
    switch (level) {
      case "Expert":
        return "text-green-700 bg-green-50";
      case "Advanced":
        return "text-blue-700 bg-blue-50";
      case "Intermediate":
        return "text-yellow-700 bg-yellow-50";
      case "Beginner":
        return "text-orange-700 bg-orange-50";
      default:
        return "text-red-700 bg-red-50";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Calculating your assessment scores...</p>
        </div>
      </div>
    );
  }

  const totalEarned = Object.values(sectionScores).reduce((sum, s) => sum + s.earnedPoints, 0);
  const totalPoints = Object.values(sectionScores).reduce((sum, s) => sum + s.totalPoints, 0);
  const overallPercentage = totalPoints > 0 ? (totalEarned / totalPoints) * 100 : 0;
  const overallCompetency = getCompetencyLevel(overallPercentage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <header className="border-b border-purple-100 bg-white shadow-sm sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ChevronLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <h1 className="text-2xl font-bold text-purple-900">Assessment Summary</h1>
            </div>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        {/* Overall Score Card */}
        <Card className="mb-12 border-purple-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">Overall Assessment Score</h2>
                <p className="text-purple-100">Your comprehensive EMT competency evaluation</p>
              </div>
              <Award className="w-16 h-16 opacity-20" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-5xl font-bold mb-2">{Math.round(overallPercentage)}%</div>
                <div className="text-purple-100">Overall Score</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">{totalEarned}</div>
                <div className="text-purple-100">Points Earned ({totalPoints} total)</div>
              </div>
              <div>
                <div className={`text-4xl font-bold mb-2 ${getCompetencyColor(overallCompetency).split(" ")[0]}`}>
                  {overallCompetency}
                </div>
                <div className="text-purple-100">Competency Level</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Competency Level Explanation */}
        <Card className="mb-12 border-purple-200 bg-gradient-to-r from-purple-50 to-purple-25">
          <CardHeader>
            <CardTitle>Competency Level Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="font-bold text-green-900">Expert</div>
                <div className="text-sm text-green-700">90-100%</div>
                <div className="text-xs text-green-600 mt-2">Mastered all competencies</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="font-bold text-blue-900">Advanced</div>
                <div className="text-sm text-blue-700">75-89%</div>
                <div className="text-xs text-blue-600 mt-2">Strong understanding</div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="font-bold text-yellow-900">Intermediate</div>
                <div className="text-sm text-yellow-700">60-74%</div>
                <div className="text-xs text-yellow-600 mt-2">Moderate understanding</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="font-bold text-orange-900">Beginner</div>
                <div className="text-sm text-orange-700">40-59%</div>
                <div className="text-xs text-orange-600 mt-2">Basic understanding</div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="font-bold text-red-900">Needs Review</div>
                <div className="text-sm text-red-700">Below 40%</div>
                <div className="text-xs text-red-600 mt-2">Requires further study</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section Scores */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Section Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {Object.entries(sectionScores).map(([key, section]) => (
            <Card
              key={key}
              className={`border-${section.color}-200 overflow-hidden hover:shadow-lg transition-shadow`}
            >
              <div
                className={`bg-gradient-to-r from-${section.color}-50 to-${section.color}-25 p-6 border-b border-${section.color}-100`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className={`text-lg font-bold text-${section.color}-900`}>{section.name}</h3>
                  </div>
                  <div className={`text-${section.color}-600`}>{section.icon}</div>
                </div>

                <div className="mb-4">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{Math.round(section.percentage)}%</div>
                  <div className="text-sm text-gray-600">
                    {section.earnedPoints} of {section.totalPoints} points
                  </div>
                </div>

                <div className={`w-full bg-gray-200 rounded-full h-3 mb-4`}>
                  <div
                    className={`bg-${section.color}-600 h-3 rounded-full`}
                    style={{ width: `${section.percentage}%` }}
                  ></div>
                </div>

                <div
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getCompetencyColor(
                    section.competencyLevel
                  )}`}
                >
                  {section.competencyLevel}
                </div>
              </div>

              <CardContent className="pt-6">
                <Link href={`/${key === "vital_signs" ? "vital-signs" : key}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    Review {section.name}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recommendations */}
        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-purple-25 mb-12">
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>Based on your assessment results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {overallPercentage >= 90 && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="font-semibold text-green-900 mb-2">🎉 Excellent Performance!</div>
                  <p className="text-green-800">
                    You have demonstrated expert-level competency across all EMT assessment areas. Continue to maintain these high standards through regular practice and skill refreshers.
                  </p>
                </div>
              )}

              {overallPercentage >= 75 && overallPercentage < 90 && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="font-semibold text-blue-900 mb-2">✓ Strong Performance</div>
                  <p className="text-blue-800">
                    You have achieved advanced competency. Focus on reviewing any sections below 75% to reach expert level.
                  </p>
                </div>
              )}

              {overallPercentage >= 60 && overallPercentage < 75 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="font-semibold text-yellow-900 mb-2">→ Continue Learning</div>
                  <p className="text-yellow-800">
                    You have intermediate understanding. Review sections with lower scores and practice the assessment items you missed.
                  </p>
                </div>
              )}

              {overallPercentage < 60 && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="font-semibold text-orange-900 mb-2">📚 Further Study Recommended</div>
                  <p className="text-orange-800">
                    Review all assessment sections carefully. Focus on sections with the lowest scores and study the specific items you need to improve.
                  </p>
                </div>
              )}

              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="font-semibold text-gray-900 mb-2">Next Steps</div>
                <ul className="text-gray-800 space-y-2 text-sm">
                  <li>• Review any sections where you scored below 75%</li>
                  <li>• Retake the assessment after additional study</li>
                  <li>• Practice hands-on skills with supervision</li>
                  <li>• Seek mentorship from experienced EMTs</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/">
            <Button variant="outline" size="lg">
              Back to Home
            </Button>
          </Link>
          <Link href="/vital-signs">
            <Button className="bg-purple-600 hover:bg-purple-700" size="lg">
              Retake Assessment
            </Button>
          </Link>
          <Button
            onClick={() => {
              // Clear all progress
              localStorage.removeItem("assessmentCheckedItems");
              window.location.reload();
            }}
            variant="outline"
            size="lg"
          >
            Reset Progress
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-8 mt-16">
        <div className="container text-center text-gray-600 text-sm">
          <p>EMT Daily Skill Assessment © 2024</p>
          <p className="mt-2">Assessment completed on {new Date().toLocaleDateString()}</p>
        </div>
      </footer>
    </div>
  );
}
