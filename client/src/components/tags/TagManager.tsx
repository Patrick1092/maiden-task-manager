import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Plus, Tag as TagIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const PRESET_COLORS = [
  { name: "Rouge", value: "red" },
  { name: "Orange", value: "orange" },
  { name: "Jaune", value: "yellow" },
  { name: "Vert", value: "green" },
  { name: "Bleu", value: "blue" },
  { name: "Indigo", value: "indigo" },
  { name: "Violet", value: "purple" },
  { name: "Rose", value: "pink" },
];

export function TagManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [tagName, setTagName] = useState("");
  const [selectedColor, setSelectedColor] = useState("blue");

  const { data: tags = [], isLoading } = trpc.tags.list.useQuery();
  const utils = trpc.useUtils();

  const createTagMutation = trpc.tags.create.useMutation({
    onSuccess: () => {
      utils.tags.list.invalidate();
      setTagName("");
      setSelectedColor("blue");
      setIsOpen(false);
      toast.success("Tag créé avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const deleteTagMutation = trpc.tags.delete.useMutation({
    onSuccess: () => {
      utils.tags.list.invalidate();
      toast.success("Tag supprimé");
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const handleCreateTag = () => {
    if (!tagName.trim()) {
      toast.error("Le nom du tag est requis");
      return;
    }

    createTagMutation.mutate({
      name: tagName.trim(),
      color: selectedColor,
    });
  };

  const handleDeleteTag = (tagId: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce tag ?")) {
      deleteTagMutation.mutate({ id: tagId });
    }
  };

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      red: "bg-red-500",
      orange: "bg-orange-500",
      yellow: "bg-yellow-500",
      green: "bg-green-500",
      blue: "bg-blue-500",
      indigo: "bg-indigo-500",
      purple: "bg-purple-500",
      pink: "bg-pink-500",
    };
    return colorMap[color] || "bg-gray-500";
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Chargement des tags...</div>;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TagIcon className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Mes Tags</h3>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nouveau tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau tag</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="tagName">Nom du tag</Label>
                <Input
                  id="tagName"
                  placeholder="Ex: Travail, Personnel, Urgent..."
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  maxLength={50}
                />
              </div>
              <div className="space-y-2">
                <Label>Couleur</Label>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      className={`h-10 rounded-md ${getColorClass(color.value)} ${
                        selectedColor === color.value ? "ring-2 ring-offset-2 ring-primary" : ""
                      } transition-all hover:scale-105`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
              <Button
                onClick={handleCreateTag}
                disabled={createTagMutation.isPending}
                className="w-full"
              >
                {createTagMutation.isPending ? "Création..." : "Créer le tag"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {tags.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Aucun tag créé. Créez votre premier tag pour organiser vos tâches !
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm ${getColorClass(
                tag.color
              )}`}
            >
              <span>{tag.name}</span>
              <button
                onClick={() => handleDeleteTag(tag.id)}
                className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                title="Supprimer le tag"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
