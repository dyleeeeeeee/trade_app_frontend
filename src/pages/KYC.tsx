import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  FileText,
  User,
  CreditCard,
  Camera
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function KYC() {
  const { toast } = useToast();
  const [kycStatus, setKycStatus] = useState<'pending' | 'submitted' | 'verified' | 'rejected'>('pending');
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    nationality: '',
    idType: '',
    idNumber: '',
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API call
    setKycStatus('submitted');
    toast({
      title: "Documents submitted",
      description: "We're reviewing your details. This usually takes 1 to 2 business days, and we'll let you know when you're verified.",
    });
  };

  const kycSteps = [
    {
      title: 'Your details',
      description: 'Name, date of birth, nationality',
      icon: User,
      status: formData.fullName ? 'complete' : 'pending'
    },
    {
      title: 'Your ID',
      description: 'A government-issued document',
      icon: CreditCard,
      status: formData.idNumber ? 'complete' : 'pending'
    },
    {
      title: 'Your address',
      description: 'Where you live',
      icon: FileText,
      status: formData.address ? 'complete' : 'pending'
    },
    {
      title: 'A quick selfie',
      description: 'To match your face to your ID',
      icon: Camera,
      status: 'pending'
    }
  ];

  const getStatusBadge = () => {
    switch (kycStatus) {
      case 'verified':
        return (
          <div className="flex items-center gap-2 text-success">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Verified</span>
          </div>
        );
      case 'submitted':
        return (
          <div className="flex items-center gap-2 text-warning">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Under review</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Rejected</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Not started</span>
          </div>
        );
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Verify your identity</h1>
            <p className="text-muted-foreground mt-1">A few quick steps to confirm it's you. Your information stays private and encrypted.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
            <Shield className="h-5 w-5 text-primary" />
            {getStatusBadge()}
          </div>
        </div>

        {/* KYC Status Alert */}
        {kycStatus === 'submitted' && (
          <Alert className="border-warning/50 bg-warning/10">
            <AlertCircle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-foreground">
              Your details are under review. We'll let you know as soon as you're verified, usually within 1 to 2 business days.
            </AlertDescription>
          </Alert>
        )}

        {/* Progress Steps */}
        <Card className="bg-gradient-card border-border/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Your progress</CardTitle>
            <CardDescription>Finish all four steps to get verified.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {kycSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="relative">
                    <div className={cn(
                      "p-4 rounded-lg border smooth-transition",
                      step.status === 'complete' 
                        ? "bg-success/10 border-success/30" 
                        : "bg-card border-border hover:border-primary/30"
                    )}>
                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className={cn(
                          "p-3 rounded-full",
                          step.status === 'complete' ? "bg-success/20" : "bg-primary/10"
                        )}>
                          <Icon className={cn(
                            "h-6 w-6",
                            step.status === 'complete' ? "text-success" : "text-primary"
                          )} />
                        </div>
                        <h3 className="font-medium text-sm">{step.title}</h3>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                    {index < kycSteps.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-border" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* KYC Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card className="bg-gradient-card border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Your details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full name (as shown on your ID)</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="John Doe"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="nationality">Nationality</Label>
                <Select
                  value={formData.nationality}
                  onValueChange={(value) => setFormData({ ...formData, nationality: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                    <SelectItem value="de">Germany</SelectItem>
                    <SelectItem value="fr">France</SelectItem>
                    <SelectItem value="jp">Japan</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Identity Verification */}
          <Card className="bg-gradient-card border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Your ID
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="idType">Document type</Label>
                <Select
                  value={formData.idType}
                  onValueChange={(value) => setFormData({ ...formData, idType: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose a document" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passport">Passport</SelectItem>
                    <SelectItem value="drivers">Driver's License</SelectItem>
                    <SelectItem value="national">National ID Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="idNumber">Document number</Label>
                <Input
                  id="idNumber"
                  value={formData.idNumber}
                  onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                  placeholder="The number on your document"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label>Photo of your document</Label>
                <div
                  className="mt-1 p-8 border-2 border-dashed border-border rounded-lg text-center hover:border-primary/50 smooth-transition cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label="Upload a photo of your ID document"
                >
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Drag a file here, or click to choose one</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG or JPG, up to 10 MB</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card className="bg-gradient-card border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Your address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Street address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Main Street"
                  className="mt-1"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="New York"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal code</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="10001"
                    className="mt-1"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) => setFormData({ ...formData, country: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                    <SelectItem value="de">Germany</SelectItem>
                    <SelectItem value="fr">France</SelectItem>
                    <SelectItem value="jp">Japan</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Selfie Verification */}
          <Card className="bg-gradient-card border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                A quick selfie
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Hold your ID next to your face and take a clear photo. This confirms the document is yours.
                  </AlertDescription>
                </Alert>
                <div
                  className="p-8 border-2 border-dashed border-border rounded-lg text-center hover:border-primary/50 smooth-transition cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label="Take or upload a selfie holding your ID"
                >
                  <Camera className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Open your camera</p>
                  <p className="text-xs text-muted-foreground mt-1">Or upload a photo instead</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="lg:col-span-2">
            <Button 
              type="submit" 
              size="lg" 
              className="w-full"
              variant="premium"
              disabled={kycStatus === 'submitted' || kycStatus === 'verified'}
            >
              {kycStatus === 'submitted' ? 'Under review' : 'Submit for verification'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}