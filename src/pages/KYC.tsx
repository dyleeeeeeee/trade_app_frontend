import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

  const completedSteps = kycSteps.filter((step) => step.status === 'complete').length;
  const progressPct = Math.round((completedSteps / kycSteps.length) * 100);

  const statusMeta = {
    verified: { label: 'Verified', tone: 'success', icon: CheckCircle },
    submitted: { label: 'Under review', tone: 'info', icon: AlertCircle },
    rejected: { label: 'Rejected', tone: 'error', icon: AlertCircle },
    pending: { label: 'Not started', tone: 'warning', icon: AlertCircle },
  } as const;

  const getStatusBadge = () => {
    const meta = statusMeta[kycStatus];
    const Icon = meta.icon;
    return (
      <span
        className={cn(
          'inline-flex items-center gap-2 rounded-full px-3 py-1 text-caption font-medium',
          meta.tone === 'success' && 'bg-feedback-success/15 text-feedback-success',
          meta.tone === 'info' && 'bg-feedback-info/15 text-feedback-info',
          meta.tone === 'error' && 'bg-feedback-error/15 text-feedback-error',
          meta.tone === 'warning' && 'bg-feedback-warning/15 text-feedback-warning',
        )}
      >
        <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        {meta.label}
      </span>
    );
  };

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-caption uppercase text-text-tertiary">Identity verification</p>
            <h1 className="text-h1 text-text-primary">Verify your identity</h1>
            <p className="max-w-xl text-body text-text-secondary">
              A few quick steps to confirm it's you. Your information stays private and encrypted.
            </p>
          </div>
          <span className="glass-inset inline-flex items-center gap-3 rounded-full px-4 py-2.5">
            <Shield className="h-5 w-5 text-interactive" strokeWidth={1.5} aria-hidden="true" />
            {getStatusBadge()}
          </span>
        </header>

        {/* KYC Status Alert */}
        {kycStatus === 'submitted' && (
          <Card className="border-feedback-info/30 bg-feedback-info/10 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-feedback-info" strokeWidth={1.5} aria-hidden="true" />
              <p className="text-body-sm text-text-secondary">
                Your details are under review. We'll let you know as soon as you're verified, usually within 1 to 2 business days.
              </p>
            </div>
          </Card>
        )}

        {/* Progress Stepper */}
        <Card className="p-6">
          <CardHeader className="p-0">
            <div className="flex items-end justify-between gap-4">
              <div className="flex flex-col gap-1">
                <CardTitle>Your progress</CardTitle>
                <CardDescription>Finish all four steps to get verified.</CardDescription>
              </div>
              <p className="font-mono text-body-sm tabular-nums text-text-tertiary">
                {completedSteps}/{kycSteps.length}
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-6">
            {/* Progress bar */}
            <div className="glass-inset mb-6 h-1.5 w-full overflow-hidden rounded-full">
              <div
                className="h-full rounded-full bg-interactive transition-[width] duration-interaction ease-decelerate"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {kycSteps.map((step, index) => {
                const Icon = step.icon;
                const complete = step.status === 'complete';
                return (
                  <div
                    key={index}
                    className={cn(
                      'flex flex-col items-center gap-3 rounded-xl p-5 text-center transition-colors duration-interaction ease-standard',
                      complete
                        ? 'border border-feedback-success/30 bg-feedback-success/10'
                        : 'glass-inset',
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-full',
                        complete ? 'bg-feedback-success/15' : 'bg-interactive/10',
                      )}
                      aria-hidden="true"
                    >
                      <Icon
                        className={cn('h-6 w-6', complete ? 'text-feedback-success' : 'text-interactive')}
                        strokeWidth={1.5}
                      />
                    </span>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-body-sm font-medium text-text-primary">{step.title}</h3>
                      <p className="text-caption text-text-tertiary">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* KYC Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Personal Information */}
          <Card className="p-6">
            <CardHeader className="p-0">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-interactive" strokeWidth={1.5} aria-hidden="true" />
                Your details
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5 p-0 pt-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="fullName">Full name (as shown on your ID)</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="dateOfBirth">Date of birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Select
                  value={formData.nationality}
                  onValueChange={(value) => setFormData({ ...formData, nationality: value })}
                >
                  <SelectTrigger>
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
          <Card className="p-6">
            <CardHeader className="p-0">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-interactive" strokeWidth={1.5} aria-hidden="true" />
                Your ID
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5 p-0 pt-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="idType">Document type</Label>
                <Select
                  value={formData.idType}
                  onValueChange={(value) => setFormData({ ...formData, idType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a document" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passport">Passport</SelectItem>
                    <SelectItem value="drivers">Driver's License</SelectItem>
                    <SelectItem value="national">National ID Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="idNumber">Document number</Label>
                <Input
                  id="idNumber"
                  value={formData.idNumber}
                  onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                  placeholder="The number on your document"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Photo of your document</Label>
                <div
                  className="glass-inset flex flex-col items-center gap-2 rounded-xl border border-dashed border-white/[0.12] p-8 text-center transition-colors duration-interaction ease-standard hover:border-interactive/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label="Upload a photo of your ID document"
                >
                  <Upload className="h-8 w-8 text-text-tertiary" strokeWidth={1.5} aria-hidden="true" />
                  <p className="text-body-sm text-text-secondary">Drag a file here, or click to choose one</p>
                  <p className="text-caption text-text-tertiary">PNG or JPG, up to 10 MB</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card className="p-6">
            <CardHeader className="p-0">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-interactive" strokeWidth={1.5} aria-hidden="true" />
                Your address
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5 p-0 pt-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="address">Street address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Main Street"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="New York"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="postalCode">Postal code</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="10001"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) => setFormData({ ...formData, country: value })}
                >
                  <SelectTrigger>
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
          <Card className="p-6">
            <CardHeader className="p-0">
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-interactive" strokeWidth={1.5} aria-hidden="true" />
                A quick selfie
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5 p-0 pt-6">
              <div className="glass-inset flex items-start gap-3 rounded-xl p-4">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-interactive" strokeWidth={1.5} aria-hidden="true" />
                <p className="text-body-sm text-text-secondary">
                  Hold your ID next to your face and take a clear photo. This confirms the document is yours.
                </p>
              </div>
              <div
                className="glass-inset flex flex-col items-center gap-2 rounded-xl border border-dashed border-white/[0.12] p-8 text-center transition-colors duration-interaction ease-standard hover:border-interactive/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label="Take or upload a selfie holding your ID"
              >
                <Camera className="h-8 w-8 text-text-tertiary" strokeWidth={1.5} aria-hidden="true" />
                <p className="text-body-sm text-text-secondary">Open your camera</p>
                <p className="text-caption text-text-tertiary">Or upload a photo instead</p>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="lg:col-span-2">
            <Button
              type="submit"
              size="lg"
              className="w-full"
              variant="primary"
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
