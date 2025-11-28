import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Activity, Pill, Stethoscope } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b border-blue-100 bg-white shadow-sm">
        <div className="container py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-blue-900">EMT Daily Skill Assessment</h1>
          </div>
          <p className="text-gray-600">Comprehensive checklist for emergency medical technician training and certification</p>
        </div>
      </header>

      {/* Hero Section with Image */}
      <section className="bg-white border-b border-blue-100">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Master Essential EMT Skills</h2>
              <p className="text-lg text-gray-600 mb-6">
                A structured assessment framework covering vital signs monitoring, emergency medications, and critical medical equipment. Perfect for EMT training, certification, and daily skill verification.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">✓</span>
                  </div>
                  <span className="text-gray-700">7 Vital Signs Assessment Categories</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">✓</span>
                  </div>
                  <span className="text-gray-700">32 Emergency Medications & Fluids</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">✓</span>
                  </div>
                  <span className="text-gray-700">13 Medical Equipment Checklists</span>
                </div>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                src="/hero-vital-signs.jpg" 
                alt="EMT checking vital signs" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Assessment Sections */}
      <section className="container py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Assessment Categories</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Vital Signs Card */}
          <Link href="/vital-signs">
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-blue-200 hover:border-blue-400">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Vital Signs</CardTitle>
                <CardDescription>7 Categories</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Master the assessment of blood pressure, pulse, temperature, oxygen saturation, glucose levels, pupil response, and skin condition.
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Blood Pressure Measurement</p>
                  <p>• Pulse Assessment</p>
                  <p>• Temperature Assessment</p>
                  <p>• SpO₂ Measurement</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Drugs Card */}
          <Link href="/drugs">
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-blue-200 hover:border-blue-400">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Pill className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Medications & Fluids</CardTitle>
                <CardDescription>32 Items</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Comprehensive knowledge of emergency medications including identification, route of administration, indications, contraindications, and dosage.
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Injectable Medications</p>
                  <p>• IV Fluids</p>
                  <p>• Oral Medications</p>
                  <p>• Topical Agents</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Equipment Card */}
          <Link href="/equipment">
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-blue-200 hover:border-blue-400">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Stethoscope className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-2xl">Medical Equipment</CardTitle>
                <CardDescription>13 Items</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Inspection and maintenance checklists for essential emergency medical equipment including stretchers, oxygen systems, and safety devices.
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Patient Transport Equipment</p>
                  <p>• Oxygen Delivery Systems</p>
                  <p>• Airway Management</p>
                  <p>• Immobilization Devices</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-blue-50 border-t border-blue-100 py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How to Use This Assessment</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg border border-blue-100">
              <div className="text-3xl font-bold text-blue-600 mb-3">1</div>
              <h3 className="font-semibold text-gray-900 mb-2">Select Category</h3>
              <p className="text-gray-600 text-sm">Choose from Vital Signs, Medications, or Equipment to begin your assessment.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-blue-100">
              <div className="text-3xl font-bold text-blue-600 mb-3">2</div>
              <h3 className="font-semibold text-gray-900 mb-2">Review Items</h3>
              <p className="text-gray-600 text-sm">Study each assessment item with detailed descriptions and scoring criteria.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-blue-100">
              <div className="text-3xl font-bold text-blue-600 mb-3">3</div>
              <h3 className="font-semibold text-gray-900 mb-2">Track Progress</h3>
              <p className="text-gray-600 text-sm">Monitor your understanding and competency across all assessment areas.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-blue-100">
              <div className="text-3xl font-bold text-blue-600 mb-3">4</div>
              <h3 className="font-semibold text-gray-900 mb-2">Achieve Mastery</h3>
              <p className="text-gray-600 text-sm">Complete all assessments to demonstrate comprehensive EMT competency.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Begin your EMT skill assessment journey today. Select a category above to start reviewing and mastering essential competencies.
        </p>
        <Link href="/vital-signs">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Start Assessment
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-8">
        <div className="container text-center text-gray-600 text-sm">
          <p>EMT Daily Skill Assessment Checklist © 2024</p>
          <p className="mt-2">Comprehensive training resource for emergency medical technicians</p>
        </div>
      </footer>
    </div>
  );
}
