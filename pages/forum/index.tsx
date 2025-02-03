import {
  Bell,
  Bold,
  CheckCircle,
  HelpCircle,
  ImageIcon,
  Italic,
  LinkIcon,
  List,
  Mail,
  Mic,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Body from "@/components/layout/Body";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useAuth from "@/contexts/useAuth";

interface Thread {
  id: string;
  title: string;
  description: string;
  topics: number;
  posts: number;
  lastUpdated: string;
  hasNewPosts: boolean;
}

export default function ForumPage() {
  const [threads] = useState<Thread[]>([
    {
      id: "1",
      title: "Milestone 1 Submission",
      description: "Discuss your questions here.",
      topics: 13,
      posts: 39,
      lastUpdated: "2024-01-24",
      hasNewPosts: true,
    },
    {
      id: "2",
      title: "Project Initialization Issues",
      description: "",
      topics: 24,
      posts: 108,
      lastUpdated: "2024-01-23",
      hasNewPosts: false,
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isLoading } = useAuth();

  return (
    <Body isLoading={isLoading}>
      <div className="container mx-auto py-6 px-4 space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Forum</h1>
          <div className="flex items-center gap-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>New Thread</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                  <DialogTitle>Create New Thread</DialogTitle>
                  <DialogDescription>
                    Create a new discussion thread in the forum.
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="subject"
                      className="inline-flex items-center"
                    >
                      Subject
                      <span className="text-destructive ml-1">*</span>
                    </Label>
                    <Input id="subject" required />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="message"
                      className="inline-flex items-center"
                    >
                      Message
                      <span className="text-destructive ml-1">*</span>
                    </Label>
                    <div className="border rounded-md">
                      <div className="flex flex-wrap gap-0.5 p-2 border-b">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-8 h-8 p-0"
                              >
                                <Bold className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Bold</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-8 h-8 p-0"
                              >
                                <Italic className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Italic</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-8 h-8 p-0"
                              >
                                <List className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Bullet List</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-8 h-8 p-0"
                              >
                                <LinkIcon className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Insert Link</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-8 h-8 p-0"
                              >
                                <ImageIcon className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Insert Image</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-8 h-8 p-0"
                              >
                                <Mic className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Record Audio</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-8 h-8 p-0"
                              >
                                <Video className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Record Video</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Textarea
                        id="message"
                        required
                        className="border-0 rounded-none focus-visible:ring-0"
                        rows={10}
                      />
                    </div>
                  </div>
                  <DialogFooter className="gap-2">
                    <Button type="button" variant="link">
                      Advanced
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Post to thread</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Threads</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[400px]">Thread</TableHead>
                    <TableHead className="text-center">Posts</TableHead>
                    <TableHead className="text-center">Comments</TableHead>
                    <TableHead className="text-center">Subscribed?</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {threads.map((thread) => (
                    <TableRow key={thread.id}>
                      <TableCell>
                        <div className="flex items-start gap-2">
                          {thread.hasNewPosts ? (
                            <HelpCircle className="h-4 w-4 text-blue-500 mt-1" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                          )}
                          <div>
                            <Link
                              href={`/forum/thread/${thread.id}`}
                              className="font-medium hover:underline"
                            >
                              {thread.title}
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              {thread.description}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {thread.topics}
                      </TableCell>
                      <TableCell className="text-center">
                        {thread.posts}
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="all">All Threads</TabsTrigger>
                  <TabsTrigger value="subscribed">Subscribed</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-6 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <span>Push Notifications</span>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>Email Notifications</span>
                    </div>
                    <Switch />
                  </div>
                </TabsContent>
                <TabsContent value="subscribed" className="space-y-6 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <span>Push Notifications</span>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>Email Notifications</span>
                    </div>
                    <Switch />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </Body>
  );
}
