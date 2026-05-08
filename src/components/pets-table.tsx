import { useMemo, useState } from "react";
import petsData from "@/data/pets.json";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  ArrowUpDown, ArrowUp, ArrowDown, MoreVertical, Search, Filter, ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Pet = (typeof petsData)[number];
type SortKey = "name" | "status" | "adoption_coordinator" | "foster_name" | "placement";
type SortDir = "asc" | "desc";

const STATUS_VARIANTS: Record<string, string> = {
  "In foster": "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/40 dark:text-blue-200",
  "In transit": "bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/40 dark:text-amber-200",
  "Adopted": "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-200",
};

function placementTags(p: Pet): string[] {
  const tags: string[] = [];
  if (p.needs_home_without_cats) tags.push("No cats");
  if (p.needs_home_without_dogs) tags.push("No dogs");
  if (p.needs_home_without_young_children) tags.push("No kids");
  if (p.needs_home_without_men) tags.push("No men");
  if (p.special_needs) tags.push("Special needs");
  if (tags.length === 0) tags.push("N/A");
  return tags;
}

function ageBucket(age: number): "young" | "adult" | "senior" {
  if (age < 1) return "young";
  if (age <= 8) return "adult";
  return "senior";
}

export function PetsTable() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [filterSpecies, setFilterSpecies] = useState<Set<string>>(new Set());
  const [filterAge, setFilterAge] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<Set<string>>(new Set());

  const toggleFilter = (set: Set<string>, setter: (s: Set<string>) => void, val: string) => {
    const next = new Set(set);
    next.has(val) ? next.delete(val) : next.add(val);
    setter(next);
  };

  const filtered = useMemo(() => {
    let rows = petsData as Pet[];
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.breed.toLowerCase().includes(q) ||
          p.adoption_coordinator.toLowerCase().includes(q) ||
          p.foster_name.toLowerCase().includes(q),
      );
    }
    if (filterSpecies.size) rows = rows.filter((p) => filterSpecies.has(p.species));
    if (filterAge.size) rows = rows.filter((p) => filterAge.has(ageBucket(p.age)));
    if (filterStatus.size) rows = rows.filter((p) => filterStatus.has(p.status));

    const sorted = [...rows].sort((a, b) => {
      const av =
        sortKey === "placement"
          ? placementTags(a).join(",")
          : (a as any)[sortKey] ?? "";
      const bv =
        sortKey === "placement"
          ? placementTags(b).join(",")
          : (b as any)[sortKey] ?? "";
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return sorted;
  }, [search, sortKey, sortDir, filterSpecies, filterAge, filterStatus]);

  const allSelected = filtered.length > 0 && filtered.every((p) => selected.has(p.id));
  const someSelected = filtered.some((p) => selected.has(p.id));

  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(filtered.map((p) => p.id)));
  };
  const toggleOne = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const sortBy = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const SortBtn = ({ k, label }: { k: SortKey; label: string }) => (
    <button
      type="button"
      onClick={() => sortBy(k)}
      className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground"
    >
      {label}
      {sortKey === k ? (
        sortDir === "asc" ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />
      ) : (
        <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
      )}
    </button>
  );

  const totalPets = (petsData as Pet[]).length;
  const filtersActive =
    filterSpecies.size + filterAge.size + filterStatus.size > 0 || search.trim().length > 0;

  const filterSummary = () => {
    const parts: string[] = [];
    if (filterSpecies.size) parts.push(`Species: ${[...filterSpecies].join(", ")}`);
    if (filterAge.size) parts.push(`Age: ${[...filterAge].join(", ")}`);
    if (filterStatus.size) parts.push(`Status: ${[...filterStatus].join(", ")}`);
    if (search.trim()) parts.push(`Search: "${search.trim()}"`);
    return parts.join(" · ");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">
            {filtersActive ? "Filtered Pets" : "All Pets"}{" "}
            <span className="text-muted-foreground">({filtered.length}{filtersActive ? ` of ${totalPets}` : ""})</span>
          </h2>
          {filtersActive && (
            <p className="text-xs text-muted-foreground mt-0.5">{filterSummary()}</p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search pets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1.5" />
                Filters
                {filterSpecies.size + filterAge.size + filterStatus.size > 0 && (
                  <Badge variant="secondary" className="ml-1.5 h-5 px-1.5">
                    {filterSpecies.size + filterAge.size + filterStatus.size}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Species</DropdownMenuLabel>
              {["dog", "cat"].map((v) => (
                <DropdownMenuCheckboxItem
                  key={v}
                  checked={filterSpecies.has(v)}
                  onCheckedChange={() => toggleFilter(filterSpecies, setFilterSpecies, v)}
                  onSelect={(e) => e.preventDefault()}
                >
                  {v[0].toUpperCase() + v.slice(1)}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Age</DropdownMenuLabel>
              {[
                ["young", "Young (< 1 year)"],
                ["adult", "Adult (1–8 years)"],
                ["senior", "Senior (> 8 years)"],
              ].map(([v, label]) => (
                <DropdownMenuCheckboxItem
                  key={v}
                  checked={filterAge.has(v)}
                  onCheckedChange={() => toggleFilter(filterAge, setFilterAge, v)}
                  onSelect={(e) => e.preventDefault()}
                >
                  {label}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              {["In foster", "In transit", "Adopted"].map((v) => (
                <DropdownMenuCheckboxItem
                  key={v}
                  checked={filterStatus.has(v)}
                  onCheckedChange={() => toggleFilter(filterStatus, setFilterStatus, v)}
                  onSelect={(e) => e.preventDefault()}
                >
                  {v}
                </DropdownMenuCheckboxItem>
              ))}
              {(filterSpecies.size + filterAge.size + filterStatus.size) > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => {
                      setFilterSpecies(new Set());
                      setFilterAge(new Set());
                      setFilterStatus(new Set());
                    }}
                  >
                    Clear all filters
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" disabled={selected.size === 0}>
                Bulk actions ({selected.size})
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected ? true : someSelected ? "indeterminate" : false}
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead><SortBtn k="name" label="Name" /></TableHead>
              <TableHead><SortBtn k="status" label="Status" /></TableHead>
              <TableHead><SortBtn k="adoption_coordinator" label="Adoption Coordinator" /></TableHead>
              <TableHead><SortBtn k="foster_name" label="Foster" /></TableHead>
              <TableHead><SortBtn k="placement" label="Placement notes" /></TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  No pets match your filters.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((p) => {
              const isSel = selected.has(p.id);
              return (
                <TableRow
                  key={p.id}
                  data-state={isSel ? "selected" : undefined}
                  className={cn(isSel && "bg-muted/60")}
                >
                  <TableCell>
                    <Checkbox checked={isSel} onCheckedChange={() => toggleOne(p.id)} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="h-10 w-10 rounded-full object-cover bg-muted" />
                      <div className="min-w-0">
                        <div className="font-medium leading-tight">{p.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{p.breed}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("border-0", STATUS_VARIANTS[p.status])}>
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{p.adoption_coordinator}</TableCell>
                  <TableCell>{p.foster_name}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {placementTags(p).map((t) => (
                        <Badge key={t} variant="outline" className="font-normal">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
