import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeightChart, CalorieChart } from "@/components/ProgressCharts";
import { TrendingDown, Flame, Scale, Image as ImageIcon } from "lucide-react";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
// Removed invalid getProgressStats import
import { requireSubscription } from "@/lib/subscription-guard";
import { LogProgressForm, PhotoUpload } from "@/components/ProgressForms";
import { format } from "date-fns";
import Image from "next/image";

export default async function ProgressPage() {
    await requireSubscription();
    const session = await auth();
    // Removed unused stats call
    if (!session?.user?.id) return null;

    const progressLogs = await prisma.progressLog.findMany({
        where: { userId: session.user.id },
        orderBy: { date: 'asc' },
    });

    // Prepare chart data
    const weightData = progressLogs
        .filter((log: any) => (log.metrics as any)?.weight)
        .map((log: any) => ({
            date: format(new Date(log.date), "MMM dd"),
            weight: (log.metrics as any).weight
        }));

    const calorieData = progressLogs
        .filter((log: any) => (log.metrics as any)?.calories)
        .map((log: any) => ({
            date: format(new Date(log.date), "MMM dd"),
            calories: (log.metrics as any).calories
        }));

    // Latest metrics
    const lastWeightLog = [...progressLogs].reverse().find((log: any) => (log.metrics as any)?.weight);
    const currentWeight = lastWeightLog ? (lastWeightLog.metrics as any).weight : 0;
    const firstWeightLog = progressLogs.find((log: any) => (log.metrics as any)?.weight);
    const totalLoss = firstWeightLog ? (firstWeightLog.metrics as any).weight - currentWeight : 0;

    // Get photos with dates
    const photos = progressLogs
        .filter((log: any) => log.photos && log.photos.length > 0)
        .flatMap((log: any) => log.photos.map((url: any) => ({ url, date: log.date })));

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-white uppercase tracking-tighter">Your Progress</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-black-light border-white/10 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current Weight</CardTitle>
                        <Scale className="h-4 w-4 text-brand" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{currentWeight || "--"} lbs</div>
                        <p className="text-xs text-white/50">Tracking consistently</p>
                    </CardContent>
                </Card>
                <Card className="bg-black-light border-white/10 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Calories</CardTitle>
                        <Flame className="h-4 w-4 text-brand" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">--</div>
                        <p className="text-xs text-white/50">Log nutrition soon</p>
                    </CardContent>
                </Card>
                <Card className="bg-black-light border-white/10 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Loss</CardTitle>
                        <TrendingDown className="h-4 w-4 text-brand" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalLoss > 0 ? totalLoss.toFixed(1) : 0} lbs</div>
                        <p className="text-xs text-white/50">Since starting</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <LogProgressForm />
                <PhotoUpload />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-black-light border-white/10 text-white">
                    <CardHeader>
                        <CardTitle>Weight Trends</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <WeightChart data={weightData} dataKey="weight" />
                    </CardContent>
                </Card>
                <Card className="bg-black-light border-white/10 text-white">
                    <CardHeader>
                        <CardTitle>Calorie Intake</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <CalorieChart data={calorieData} dataKey="calories" />
                    </CardContent>
                </Card>
            </div>

            {photos.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-brand" />
                        Photos Timeline
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {photos.map((photo: any, i: number) => (
                            <div key={i} className="aspect-[3/4] rounded-lg overflow-hidden border border-white/10 bg-white/5 group">
                                <div className="aspect-[3/4] relative">
                                    <Image
                                        src={photo.url}
                                        alt={`Progress from ${new Date(photo.date).toLocaleDateString()}`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
