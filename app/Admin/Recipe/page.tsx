"use client";

import AdminSidebar from "@/components/AdminSidebar";
import { 
  Clock3, 
  Plus, 
  Save, 
  Search, 
  Trash2, 
  UtensilsCrossed, 
  Users, 
  Sparkles, 
  PencilLine, 
  X,
  ChefHat
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";

type MenuItem = {
  _id: string;
  title: string;
  price?: number;
  category?: string;
  description?: string;
};

type IngredientRow = {
  name: string;
  quantity: string;
  unit: string;
};

type RecipeFormData = {
  menuId: string;
  menuTitle: string;
  ingredients: IngredientRow[];
  preparationTime: string;
  servingSize: string;
  instructions: string;
};

type StoredRecipes = Record<string, RecipeFormData>;

const API_BASE_URL = "/api/recipes";

const createEmptyIngredient = (): IngredientRow => ({
  name: "",
  quantity: "",
  unit: "",
});

const createBlankRecipe = (menuId = "", menuTitle = "") => ({
  menuId,
  menuTitle,
  ingredients: [createEmptyIngredient()],
  preparationTime: "20",
  servingSize: "1",
  instructions: "",
});

export default function RecipePage() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [selectedMenuId, setSelectedMenuId] = useState("");
  const [recipes, setRecipes] = useState<StoredRecipes>({});
  const [formData, setFormData] = useState<RecipeFormData>(createBlankRecipe());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Unified Error/Success handling alert flash timeout
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    const loadMenus = async () => {
      try {
        const response = await apiFetch("/api/menus");
        const data = await response.json();
        if (response.ok && data?.success) {
          const fetchedMenus = Array.isArray(data.menus) ? data.menus : [];
          setMenus(fetchedMenus);
          if (!selectedMenuId && fetchedMenus[0]?._id) {
            setSelectedMenuId(fetchedMenus[0]._id);
          }
        }
      } catch {
        setMessage({ type: "error", text: "Unable to load menus from the server." });
      }
    };

    const loadRecipes = async () => {
      try {
        const response = await apiFetch(API_BASE_URL);
        const data = await response.json();
        if (response.ok && data?.success) {
          const fetchedRecipes = Array.isArray(data.recipes) ? data.recipes : [];
          const recipeMap: StoredRecipes = {};

          fetchedRecipes.forEach((recipe: any) => {
            if (recipe?.menuId) {
              recipeMap[recipe.menuId] = {
                menuId: recipe.menuId,
                menuTitle: recipe.menuTitle || "",
                ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
                preparationTime: recipe.preparationTime || "20",
                servingSize: recipe.servingSize || "1",
                instructions: recipe.instructions || "",
              };
            }
          });

          setRecipes(recipeMap);
        }
      } catch {
        setRecipes({});
      } finally {
        setLoading(false);
      }
    };

    loadMenus();
    loadRecipes();
  }, [selectedMenuId]);

  // Form Sync Controller
  useEffect(() => {
    if (!selectedMenuId) return;

    const currentMenu = menus.find((menu) => menu._id === selectedMenuId);
    const savedRecipe = recipes[selectedMenuId];

    if (savedRecipe) {
      setFormData({
        ...savedRecipe,
        menuId: selectedMenuId,
        menuTitle: currentMenu?.title || savedRecipe.menuTitle || "",
      });
    } else {
      setFormData(createBlankRecipe(selectedMenuId, currentMenu?.title || ""));
    }
  }, [selectedMenuId, menus, recipes]);

  const currentMenu = useMemo(() => menus.find((menu) => menu._id === selectedMenuId), [menus, selectedMenuId]);
  const recipesList = useMemo(() => Object.values(recipes), [recipes]);
  
  const filteredRecipes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return recipesList;

    return recipesList.filter((recipe) => {
      const titleMatch = recipe.menuTitle?.toLowerCase().includes(term);
      const ingredientMatch = recipe.ingredients?.some((ingredient) => 
        ingredient.name?.toLowerCase().includes(term)
      );
      return titleMatch || ingredientMatch;
    });
  }, [recipesList, searchTerm]);

  const selectedRecipe = recipes[selectedMenuId];

  const openComposer = (menuId = "") => {
    const targetMenuId = menuId || menus[0]?._id || "";
    setSelectedMenuId(targetMenuId);
    setIsComposerOpen(true);
    setMessage(null);
  };

  const handleSelectMenu = (menuId: string) => {
    setSelectedMenuId(menuId);
    setMessage(null);
  };

  const handleInputChange = (field: keyof RecipeFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleIngredientChange = (index: number, field: keyof IngredientRow, value: string) => {
    setFormData((prev) => {
      const updatedIngredients = [...prev.ingredients];
      updatedIngredients[index] = { ...updatedIngredients[index], [field]: value };
      return { ...prev, ingredients: updatedIngredients };
    });
  };

  const addIngredient = () => {
    setFormData((prev) => ({ ...prev, ingredients: [...prev.ingredients, createEmptyIngredient()] }));
  };

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleSaveRecipe = async () => {
    if (!selectedMenuId) {
      setMessage({ type: "error", text: "Please choose a menu first." });
      return;
    }

    const cleanedIngredients = formData.ingredients.filter(
      (ingredient) => ingredient.name.trim() || ingredient.quantity.trim() || ingredient.unit.trim()
    );

    if (!cleanedIngredients.some((ingredient) => ingredient.name.trim())) {
      setMessage({ type: "error", text: "Add at least one ingredient with a valid name before saving." });
      return;
    }

    const payload = {
      menuId: selectedMenuId,
      menuTitle: currentMenu?.title || formData.menuTitle,
      ingredients: cleanedIngredients,
      preparationTime: formData.preparationTime.trim() || "20",
      servingSize: formData.servingSize.trim() || "1",
      instructions: formData.instructions.trim(),
    };

    try {
      const response = await apiFetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Unable to save recipe.");
      }

      setRecipes(prev => ({ ...prev, [selectedMenuId]: { ...payload, menuId: selectedMenuId } }));
      setIsComposerOpen(false);
      setMessage({ type: "success", text: `Recipe successfully updated for "${payload.menuTitle}".` });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Unable to save recipe." });
    }
  };

  const handleDeleteRecipe = async (targetId: string) => {
    if (!window.confirm("Are you sure you want to completely remove this recipe?")) return;

    try {
      const response = await apiFetch(`${API_BASE_URL}/${targetId}`, { method: "DELETE" });
      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Unable to delete recipe.");
      }

      setRecipes(prev => {
        const next = { ...prev };
        delete next[targetId];
        return next;
      });

      if (selectedMenuId === targetId) {
        setFormData(createBlankRecipe(targetId, menus.find(m => m._id === targetId)?.title || ""));
      }

      setIsComposerOpen(false);
      setMessage({ type: "success", text: "Recipe wiped completely." });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Unable to complete delete stack request." });
    }
  };

  const handleEditClick = (recipe: RecipeFormData) => {
    setSelectedMenuId(recipe.menuId);
    setFormData({ ...recipe });
    setIsComposerOpen(true);
  };

  return (
    <>
      <AdminSidebar />
      <div className="min-h-screen bg-slate-950 p-3 text-slate-100 sm:p-4 md:ml-72 md:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          
          {/* Main Context Header Banner */}
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-6 md:p-8 shadow-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20">
                  <UtensilsCrossed className="h-3.5 w-3.5" />
                  Kitchen Master Dashboard
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">Recipe Database Blueprint</h1>
                <p className="mt-1 text-sm text-slate-400">Map technical ingredient measures, preparation timelines, and culinary instructions directly onto system menu cards.</p>
              </div>
              <button
                onClick={() => openComposer()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/10 transition hover:bg-amber-400"
              >
                <Plus className="h-4 w-4 stroke-[3]" />
                Forge New Recipe
              </button>
            </div>
          </div>

          {/* Toast Messaging Interceptor notifications */}
          {message && (
            <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-semibold shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300 ${message.type === "success" ? "bg-emerald-950/90 border border-emerald-500/30 text-emerald-400" : "bg-rose-950/90 border border-rose-500/30 text-rose-400"}`}>
              <ChefHat className="h-5 w-5" />
              <span>{message.text}</span>
            </div>
          )}

          {/* Workspace Layout */}
          <div className="grid gap-6">
            
            {/* Action Toolbars Filter Stack */}
            <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 px-4 py-3 shadow-inner">
              <Search className="h-5 w-5 text-slate-500" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Query database across recipe metrics or core ingredients..."
                className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
              />
            </div>

            {/* Form Drawer / Active Editor Container block */}
            {isComposerOpen && (
              <div className="rounded-3xl border border-amber-500/30 bg-slate-900 p-5 shadow-2xl shadow-amber-500/5 animate-in fade-in zoom-in-95 duration-200">
                <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Core Blueprinting Node</span>
                    <h2 className="text-xl font-bold text-white">{selectedRecipe ? `Restructure: ${formData.menuTitle}` : "Create Micro-Recipe Context"}</h2>
                  </div>
                  <button 
                    onClick={() => setIsComposerOpen(false)}
                    className="rounded-xl border border-slate-800 p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Left Column: Context Links and Ingredients */}
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Target Core Menu Node Linkage</label>
                      <select
                        value={selectedMenuId}
                        onChange={(e) => handleSelectMenu(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-amber-500 transition"
                      >
                        {menus.map((menu) => (
                          <option key={menu._id} value={menu._id} className="bg-slate-900">{menu.title}</option>
                        ))}
                      </select>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">System Ingredient Matrix</h3>
                          <p className="text-xs text-slate-400">Define raw inventory measurements strictly.</p>
                        </div>
                        <button
                          onClick={addIngredient}
                          className="inline-flex items-center gap-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-700"
                        >
                          <Plus className="h-3.5 w-3.5" /> Row
                        </button>
                      </div>

                      <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
                        {formData.ingredients.map((ingredient, index) => (
                          <div key={index} className="grid gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 sm:grid-cols-[2fr_1fr_1fr_auto]">
                            <input
                              value={ingredient.name}
                              onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                              placeholder="Ingredient element name"
                              className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-amber-500"
                            />
                            <input
                              value={ingredient.quantity}
                              onChange={(e) => handleIngredientChange(index, "quantity", e.target.value)}
                              placeholder="Volume/Qty"
                              className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-amber-500"
                            />
                            <input
                              value={ingredient.unit}
                              onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
                              placeholder="Metric Unit"
                              className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-amber-500"
                            />
                            <button
                              onClick={() => removeIngredient(index)}
                              className="flex items-center justify-center rounded-lg border border-rose-900/30 bg-rose-950/40 p-2 text-rose-400 transition hover:bg-rose-900/40"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Execution Metrics & Workflow Instructions */}
                  <div className="space-y-4 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                            <Clock3 className="h-3.5 w-3.5 text-amber-400" />
                            Prep Timeline (Mins)
                          </div>
                          <input
                            value={formData.preparationTime}
                            onChange={(e) => handleInputChange("preparationTime", e.target.value)}
                            placeholder="e.g. 25"
                            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none focus:border-amber-500"
                          />
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                            <Users className="h-3.5 w-3.5 text-amber-400" />
                            Yield Servings Count
                          </div>
                          <input
                            value={formData.servingSize}
                            onChange={(e) => handleInputChange("servingSize", e.target.value)}
                            placeholder="e.g. 4"
                            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                        <div className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Execution Directives & Procedures</div>
                        <textarea
                          value={formData.instructions}
                          onChange={(e) => handleInputChange("instructions", e.target.value)}
                          rows={6}
                          placeholder="Document stepwise processes for preparation, heat variables, plating specifications..."
                          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-amber-500 transition resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
                      {selectedRecipe && (
                        <button
                          onClick={() => handleDeleteRecipe(selectedMenuId)}
                          className="rounded-xl border border-rose-900/40 bg-rose-950/20 px-4 py-2 text-sm font-semibold text-rose-400 transition hover:bg-rose-950/60"
                        >
                          Purge Recipe
                        </button>
                      )}
                      <button
                        onClick={handleSaveRecipe}
                        className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/10 transition hover:bg-amber-400"
                      >
                        <Save className="h-4 w-4" />
                        Commit Structure
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Senior Developer Enterprise-Grade Data Table view */}
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300 border-collapse">
                  {/* Table Header Row */}
                  <thead className="bg-slate-950 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                    <tr>
                      <th scope="col" className="px-6 py-4">Menu Node Linkage</th>
                      <th scope="col" className="hidden px-6 py-4 md:table-cell">Temporal Footprint</th>
                      <th scope="col" className="hidden px-6 py-4 sm:table-cell">Yield Scale</th>
                      <th scope="col" className="px-6 py-4">Ingredient Array Elements</th>
                      <th scope="col" className="px-6 py-4 text-right">Database Mutations</th>
                    </tr>
                  </thead>
                  
                  {/* Table Body Content Matrix */}
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredRecipes.length > 0 ? (
                      filteredRecipes.map((recipe) => (
                        <tr key={recipe.menuId} className="group transition hover:bg-slate-800/40">
                          <td className="whitespace-nowrap px-6 py-4.5 font-semibold text-white">
                            <div className="flex flex-col">
                              <span className="text-base font-bold text-slate-100 group-hover:text-amber-400 transition">
                                {recipe.menuTitle}
                              </span>
                              <span className="text-xxs tracking-mono font-mono text-slate-500">
                                ID: {recipe.menuId}
                              </span>
                            </div>
                          </td>
                          <td className="hidden whitespace-nowrap px-6 py-4.5 md:table-cell">
                            <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-950 px-2.5 py-1 text-xs font-medium text-slate-300 border border-slate-800">
                              <Clock3 className="h-3 w-3 text-amber-500" />
                              {recipe.preparationTime || "20"} min
                            </span>
                          </td>
                          <td className="hidden whitespace-nowrap px-6 py-4.5 sm:table-cell text-slate-400">
                            <span className="font-mono text-slate-200">{recipe.servingSize || "1"}</span> servings
                          </td>
                          <td className="px-6 py-4.5">
                            <div className="flex flex-wrap gap-1.5 max-w-xs md:max-w-md">
                              {(recipe.ingredients || []).map((ing, i) => (
                                <span 
                                  key={`${recipe.menuId}-ing-${i}`} 
                                  className="inline-flex items-center rounded-md bg-slate-950 border border-slate-800/80 px-2 py-0.5 text-xs text-slate-400"
                                >
                                  {ing.name} <span className="ml-1 font-mono text-amber-400/80 text-[10px]">{ing.quantity}{ing.unit}</span>
                                </span>
                              ))}
                              {(recipe.ingredients || []).length === 0 && (
                                <span className="text-xs italic text-slate-600">Zero elements logged</span>
                              )}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEditClick(recipe)}
                                className="inline-flex items-center gap-1 rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-amber-500/50 hover:bg-slate-800 hover:text-amber-400"
                              >
                                <PencilLine className="h-3.5 w-3.5" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteRecipe(recipe.menuId)}
                                className="inline-flex items-center justify-center rounded-lg border border-transparent p-1.5 text-slate-500 hover:border-rose-900/30 hover:bg-rose-950/30 hover:text-rose-400 transition"
                                title="Execute Delete Protocol"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="bg-slate-950/40 p-12 text-center text-sm text-slate-500 italic">
                          No matching recipes isolated within current search schemas.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}