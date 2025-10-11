import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  Calendar,
  Sparkles,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function EventIDGenerator() {
  const [eventName, setEventName] = useState("");
  const [eventCategory, setEventCategory] = useState("");
  const [eventDay, setEventDay] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [generatedId, setGeneratedId] = useState("");
  const [copiedId, setCopiedId] = useState("");
  const [savedEvents, setSavedEvents] = useState<Array<{id: string, name: string, category: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch saved events from database on component mount
  useEffect(() => {
    fetchSavedEvents();
  }, []);

  const fetchSavedEvents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/api/v1/events");
      const data = await response.json();

      if (data.success && data.data.events) {
        const events = data.data.events
          .filter((e: any) => e.eventId) // Only show events with eventId
          .map((e: any) => ({
            id: e.eventId,
            name: e.title,
            category: e.category || "General",
          }));
        setSavedEvents(events);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
      toast.error("Failed to load saved events");
    } finally {
      setIsLoading(false);
    }
  };

  const generateEventId = () => {
    try {
      if (!eventName.trim()) {
        toast.error("Please enter an event name");
        return;
      }

      // Convert event name to lowercase, replace spaces with hyphens, remove special chars
      const cleanName = eventName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      // Add category prefix if selected (ignore "none")
      const categoryPrefix = (eventCategory && eventCategory !== "none") 
        ? `${eventCategory.toLowerCase()}-` 
        : '';
      
      // Add day suffix if selected (ignore "none")
      const daySuffix = (eventDay && eventDay !== "none") 
        ? `-day${eventDay}` 
        : '';
      
      // Add time suffix if selected (ignore "none")
      const timeSuffix = (eventTime && eventTime !== "none") 
        ? `-${eventTime.toLowerCase()}` 
        : '';

      const finalId = `${categoryPrefix}${cleanName}${daySuffix}${timeSuffix}`;
      
      setGeneratedId(finalId);
      toast.success("Event ID Generated!", {
        description: finalId,
      });
    } catch (error) {
      console.error("Generate ID error:", error);
      toast.error("Failed to generate event ID");
    }
  };

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(text);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedId(""), 2000);
    } else {
      toast.error("Clipboard not available");
    }
  };

  const saveEvent = async () => {
    if (!generatedId) {
      toast.error("Generate an Event ID first");
      return;
    }

    if (!eventName.trim()) {
      toast.error("Event name is required");
      return;
    }

    try {
      setIsSaving(true);

      // Save to database
      const response = await fetch("http://localhost:5000/api/v1/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: generatedId,
          title: eventName,
          category: eventCategory || "General",
          // Provide default values for required fields
          date: new Date().toISOString().split('T')[0], // Today's date as placeholder
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          venue: "TBD", // Placeholder venue
          description: `Event generated with ID: ${generatedId}`,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Event saved to database!");
        
        // Refresh the saved events list
        await fetchSavedEvents();

        // Clear form
        setEventName("");
        setEventCategory("");
        setEventDay("");
        setEventTime("");
        setGeneratedId("");
      } else {
        toast.error(data.message || "Failed to save event");
      }
    } catch (error) {
      console.error("Save event error:", error);
      toast.error("Failed to save event to database");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/events/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Event removed from database");
        // Refresh the list
        await fetchSavedEvents();
      } else {
        toast.error(data.message || "Failed to delete event");
      }
    } catch (error) {
      console.error("Delete event error:", error);
      toast.error("Failed to delete event");
    }
  };

  const exportEventList = () => {
    try {
      const eventData = savedEvents.map(e => `${e.id} | ${e.name} | ${e.category}`).join('\n');
      const blob = new Blob([eventData], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'esummit-2026-event-ids.txt';
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Event list exported!");
    } catch (error) {
      toast.error("Failed to export event list");
      console.error("Export error:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Generator Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Event ID Generator
          </CardTitle>
          <CardDescription>
            Generate unique event IDs for E-Summit 2026 check-in system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Event Name */}
          <div className="space-y-2">
            <Label htmlFor="eventName">Event Name *</Label>
            <Input
              id="eventName"
              placeholder="e.g., AI and Machine Learning Workshop"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </div>

          {/* Category, Day, Time in Grid */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={eventCategory} onValueChange={setEventCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="keynote">Keynote</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="panel">Panel</SelectItem>
                  <SelectItem value="talk">Talk</SelectItem>
                  <SelectItem value="competition">Competition</SelectItem>
                  <SelectItem value="networking">Networking</SelectItem>
                  <SelectItem value="meal">Meal</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="day">Day</Label>
              <Select value={eventDay} onValueChange={setEventDay}>
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="1">Day 1</SelectItem>
                  <SelectItem value="2">Day 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time Slot</Label>
              <Select value={eventTime} onValueChange={setEventTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="afternoon">Afternoon</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generate Button */}
          <Button onClick={generateEventId} className="w-full">
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Event ID
          </Button>

          {/* Generated ID Display */}
          {generatedId && (
            <div className="rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-900 dark:text-green-100">
                  Generated Event ID:
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(generatedId)}
                    className="h-8"
                  >
                    {copiedId === generatedId ? (
                      <Check className="h-3 w-3 mr-1" />
                    ) : (
                      <Copy className="h-3 w-3 mr-1" />
                    )}
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    onClick={saveEvent}
                    className="h-8"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    ) : (
                      <Plus className="h-3 w-3 mr-1" />
                    )}
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
              <code className="text-lg font-mono text-green-700 dark:text-green-300 break-all">
                {generatedId}
              </code>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Saved Events List */}
      {isLoading ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
            <p className="text-sm text-muted-foreground mt-4">Loading saved events...</p>
          </CardContent>
        </Card>
      ) : savedEvents.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Saved Event IDs ({savedEvents.length})
              </CardTitle>
              <Button variant="outline" size="sm" onClick={exportEventList}>
                Export List
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {savedEvents.map((event, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-sm font-mono text-primary">
                        {event.id}
                      </code>
                      <Badge variant="secondary" className="text-xs">
                        {event.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{event.name}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(event.id)}
                    >
                      {copiedId === event.id ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteEvent(event.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
