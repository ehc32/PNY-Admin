"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { crearBien, type Category } from "@/lib/api/assets-service"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import {
    ArrowLeft,
    Package,
    MapPin,
    Calendar,
    Factory,
    Hash,
    User,
    Building2,
    Phone,
    Upload,
    X,
    Camera,
    FileText,
} from "lucide-react"

const API_BASE_URL = "https://stingray-app-e496q.ondigitalocean.app"

interface Environment {
    _id: string
    name: string
    code: string
    status: boolean
}

interface AssetFormData {
    name: string
    location: string
    acquisitionDate: string
    brand: string
    modelo: string
    equipmentType: string
    serialNumber: string
    inventoryCode: string
    accountHolder: string
    categoryId: string
    environmentId: string
    status: boolean
    manufacturerName: string
    manufacturerAddress: string
    manufacturerPhone: string
    supplierName: string
    supplierAddress: string
    supplierPhone: string
}

// estado inicial reutilizable
const initialFormData: AssetFormData = {
    name: "",
    location: "",
    acquisitionDate: "",
    brand: "",
    modelo: "",
    equipmentType: "",
    serialNumber: "",
    inventoryCode: "",
    accountHolder: "",
    categoryId: "",
    environmentId: "",
    status: true,
    manufacturerName: "",
    manufacturerAddress: "",
    manufacturerPhone: "",
    supplierName: "",
    supplierAddress: "",
    supplierPhone: "",
}

export default function AddAssetPage() {
    const router = useRouter()
    const { token } = useAuth()
    const [categories, setCategories] = useState<Category[]>([])
    const [environments, setEnvironments] = useState<Environment[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const [showSuccessDialog, setShowSuccessDialog] = useState(false)
    const [createdAsset, setCreatedAsset] = useState<any>(null)

    const [formData, setFormData] = useState<AssetFormData>(initialFormData)

    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string>("")

    const handleChange = (field: keyof AssetFormData, value: string | boolean) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const resetForm = () => {
        setFormData(initialFormData)
        setImageFile(null)
        setImagePreview("")
    }

    useEffect(() => {
        const fetchData = async () => {
            if (!token) return
            try {
                // Cargar categorías
                const categoriesResponse = await fetch(`${API_BASE_URL}/Categorias`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                if (categoriesResponse.ok) {
                    const categoriesData = await categoriesResponse.json()
                    // Filtrar solo categorías activas (state: true)
                    const activeCategories = categoriesData.filter(
                        (cat: Category & { state?: boolean }) => cat.state !== false,
                    )
                    setCategories(activeCategories)
                }

                // Cargar ambientes
                const environmentsResponse = await fetch(`${API_BASE_URL}/environments`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                if (environmentsResponse.ok) {
                    const environmentsData = await environmentsResponse.json()
                    // Filtrar solo ambientes activos (status: true)
                    const activeEnvironments = environmentsData.filter((env: Environment) => env.status === true)
                    setEnvironments(activeEnvironments)
                }
            } catch (error) {
                console.error("Error al cargar datos:", error)
                toast.error("Error al cargar datos")
            }
        }
        fetchData()
    }, [token])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Validación de tamaño (5MB máximo)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("La imagen no debe superar 5MB")
                return
            }

            setImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleRemoveImage = () => {
        setImageFile(null)
        setImagePreview("")
        const fileInput = document.getElementById("image") as HTMLInputElement | null
        if (fileInput) fileInput.value = ""
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!token) return

        // Validaciones básicas
        if (!formData.name || !formData.location || !formData.acquisitionDate) {
            toast.error("Por favor completa todos los campos requeridos")
            return
        }

        setIsLoading(true)

        try {
            const assetData = {
                name: formData.name,
                location: formData.location,
                acquisitionDate: new Date(formData.acquisitionDate).toISOString(),
                brand: formData.brand,
                modelo: formData.modelo,
                equipmentType: formData.equipmentType,
                serialNumber: formData.serialNumber,
                inventoryCode: formData.inventoryCode,
                accountHolder: formData.accountHolder,
                environmentId: formData.environmentId,
                categoryId: formData.categoryId,
                status: formData.status,
                manufacturer: {
                    name: formData.manufacturerName,
                    address: formData.manufacturerAddress,
                    phone: formData.manufacturerPhone,
                },
                supplier: {
                    name: formData.supplierName,
                    address: formData.supplierAddress,
                    phone: formData.supplierPhone,
                },
                image: imagePreview, // Base64 image
            }

            const result = await crearBien(token, assetData)

            setCreatedAsset(result)
            setShowSuccessDialog(true)
            toast.success("Bien creado exitosamente")
        } catch (error) {
            console.error("Error:", error)
            toast.error(error instanceof Error ? error.message : "Error al crear el bien")
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoToList = () => {
        router.push("/assets")
    }

    const handleGoToDetail = () => {
        if (createdAsset?._id) {
            router.push(`/assets/${createdAsset._id}`)
        } else {
            router.push("/assets")
        }
    }

    const handleCreateAnother = () => {
        resetForm()
        setCreatedAsset(null)
        setShowSuccessDialog(false)
    }

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/assets">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Agregar Bien</h1>
                        <p className="text-sm text-muted-foreground">Registra un nuevo bien en el sistema</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Sección 1: Información General */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Package className="h-5 w-5" />
                                Información General del Bien
                            </CardTitle>
                            <CardDescription>Datos básicos del bien</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Nombre */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="flex items-center gap-2">
                                        <Package className="h-4 w-4 text-muted-foreground" />
                                        Nombre del bien <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleChange("name", e.target.value)}
                                        placeholder="Ej: Computadora Dell Optiplex"
                                        required
                                        className="h-11"
                                    />
                                </div>

                                {/* Ubicación */}
                                <div className="space-y-2">
                                    <Label htmlFor="location" className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        Ubicación <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={(e) => handleChange("location", e.target.value)}
                                        placeholder="Ej: Oficina 201"
                                        required
                                        className="h-11"
                                    />
                                </div>

                                {/* Tipo de equipo */}
                                <div className="space-y-2">
                                    <Label htmlFor="equipmentType">
                                        Tipo de equipo <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="equipmentType"
                                        value={formData.equipmentType}
                                        onChange={(e) => handleChange("equipmentType", e.target.value)}
                                        placeholder="Ej: Computadora de escritorio"
                                        required
                                        className="h-11"
                                    />
                                </div>

                                {/* Fecha de adquisición */}
                                <div className="space-y-2">
                                    <Label htmlFor="acquisitionDate" className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        Fecha de adquisición <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="acquisitionDate"
                                        type="date"
                                        value={formData.acquisitionDate}
                                        onChange={(e) => handleChange("acquisitionDate", e.target.value)}
                                        required
                                        className="h-11"
                                    />
                                </div>

                                {/* Categoría */}
                                <div className="space-y-2">
                                    <Label htmlFor="categoryId">
                                        Categoría <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        value={formData.categoryId || "none"}
                                        onValueChange={(v) => handleChange("categoryId", v === "none" ? "" : v)}
                                    >
                                        <SelectTrigger id="categoryId" className="pl-10 h-11 w-full">
                                            <SelectValue placeholder="Selecciona una categoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Sin categoría</SelectItem>
                                            {categories.map((category) => (
                                                <SelectItem key={category._id} value={category._id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Ambiente */}
                                <div className="space-y-2">
                                    <Label htmlFor="environmentId">Ambiente</Label>
                                    <Select
                                        value={formData.environmentId || "none"}
                                        onValueChange={(v) => handleChange("environmentId", v === "none" ? "" : v)}
                                    >
                                        <SelectTrigger id="environmentId" className="pl-10 h-11 w-full">
                                            <SelectValue placeholder="Selecciona un ambiente" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Sin ambiente</SelectItem>
                                            {environments.map((environment) => (
                                                <SelectItem key={environment._id} value={environment._id}>
                                                    {environment.name} ({environment.code})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Responsable */}
                                <div className="space-y-2">
                                    <Label htmlFor="accountHolder" className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        Responsable <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="accountHolder"
                                        value={formData.accountHolder}
                                        onChange={(e) => handleChange("accountHolder", e.target.value)}
                                        placeholder="Nombre del responsable"
                                        required
                                        className="h-11"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sección 2: Especificaciones Técnicas */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <FileText className="h-5 w-5" />
                                Especificaciones Técnicas
                            </CardTitle>
                            <CardDescription>Detalles técnicos y números de identificación</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Marca */}
                                <div className="space-y-2">
                                    <Label htmlFor="brand" className="flex items-center gap-2">
                                        <Factory className="h-4 w-4 text-muted-foreground" />
                                        Marca <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="brand"
                                        value={formData.brand}
                                        onChange={(e) => handleChange("brand", e.target.value)}
                                        placeholder="Ej: Dell"
                                        required
                                        className="h-11"
                                    />
                                </div>

                                {/* Modelo */}
                                <div className="space-y-2">
                                    <Label htmlFor="modelo">
                                        Modelo <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="modelo"
                                        value={formData.modelo}
                                        onChange={(e) => handleChange("modelo", e.target.value)}
                                        placeholder="Ej: Optiplex 7090"
                                        required
                                        className="h-11"
                                    />
                                </div>

                                {/* Número de serie */}
                                <div className="space-y-2">
                                    <Label htmlFor="serialNumber" className="flex items-center gap-2">
                                        <Hash className="h-4 w-4 text-muted-foreground" />
                                        Número de serie <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="serialNumber"
                                        value={formData.serialNumber}
                                        onChange={(e) => handleChange("serialNumber", e.target.value)}
                                        placeholder="Ej: SN123456789"
                                        required
                                        className="h-11 font-mono"
                                    />
                                </div>

                                {/* Código de inventario */}
                                <div className="space-y-2">
                                    <Label htmlFor="inventoryCode" className="flex items-center gap-2">
                                        <Hash className="h-4 w-4 text-muted-foreground" />
                                        Código de inventario <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="inventoryCode"
                                        value={formData.inventoryCode}
                                        onChange={(e) => handleChange("inventoryCode", e.target.value)}
                                        placeholder="Ej: INV-2024-001"
                                        required
                                        className="h-11 font-mono"
                                    />
                                </div>

                                {/* Estado */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="status">Estado inicial</Label>
                                    <Select
                                        value={formData.status.toString()}
                                        onValueChange={(v) => handleChange("status", v === "true")}
                                    >
                                        <SelectTrigger id="status" className="h-11 w-full md:w-1/2">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="true">Activo</SelectItem>
                                            <SelectItem value="false">Inactivo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sección 3: Fabricante y Proveedor */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Building2 className="h-5 w-5" />
                                Fabricante y Proveedor
                            </CardTitle>
                            <CardDescription>Información de contacto del fabricante y proveedor</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Fabricante */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-sm flex items-center gap-2">
                                    <Factory className="h-4 w-4" />
                                    Fabricante
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="manufacturerName">Nombre</Label>
                                        <Input
                                            id="manufacturerName"
                                            value={formData.manufacturerName}
                                            onChange={(e) => handleChange("manufacturerName", e.target.value)}
                                            placeholder="Nombre del fabricante"
                                            className="h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="manufacturerAddress">Dirección</Label>
                                        <Input
                                            id="manufacturerAddress"
                                            value={formData.manufacturerAddress}
                                            onChange={(e) => handleChange("manufacturerAddress", e.target.value)}
                                            placeholder="Dirección"
                                            className="h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="manufacturerPhone" className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            Teléfono
                                        </Label>
                                        <Input
                                            id="manufacturerPhone"
                                            value={formData.manufacturerPhone}
                                            onChange={(e) => handleChange("manufacturerPhone", e.target.value)}
                                            placeholder="Teléfono"
                                            className="h-11"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Proveedor */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-sm flex items-center gap-2">
                                    <Building2 className="h-4 w-4" />
                                    Proveedor
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="supplierName">Nombre</Label>
                                        <Input
                                            id="supplierName"
                                            value={formData.supplierName}
                                            onChange={(e) => handleChange("supplierName", e.target.value)}
                                            placeholder="Nombre del proveedor"
                                            className="h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="supplierAddress">Dirección</Label>
                                        <Input
                                            id="supplierAddress"
                                            value={formData.supplierAddress}
                                            onChange={(e) => handleChange("supplierAddress", e.target.value)}
                                            placeholder="Dirección"
                                            className="h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="supplierPhone" className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            Teléfono
                                        </Label>
                                        <Input
                                            id="supplierPhone"
                                            value={formData.supplierPhone}
                                            onChange={(e) => handleChange("supplierPhone", e.target.value)}
                                            placeholder="Teléfono"
                                            className="h-11"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Imagen del bien */}
                    <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-muted/30 border-2 border-dashed border-border/50">
                        <div className="relative">
                            {imagePreview ? (
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-lg overflow-hidden border-4 border-background shadow-lg ring-2 ring-primary/20">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute -top-2 -right-2 h-8 w-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={handleRemoveImage}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="w-32 h-32 rounded-lg bg-muted border-4 border-background shadow-lg flex items-center justify-center">
                                    <Camera className="h-12 w-12 text-muted-foreground" />
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <Label htmlFor="image" className="cursor-pointer">
                                <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                                    <Upload className="h-4 w-4" />
                                    <span className="text-sm font-medium">
                                        {imagePreview ? "Cambiar imagen" : "Subir imagen del bien"}
                                    </span>
                                </div>
                                <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </Label>
                            <p className="text-xs text-muted-foreground text-center">JPG, PNG o WEBP (máx. 5MB)</p>
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-3 justify-end">
                        <Link href="/assets">
                            <Button type="button" variant="outline" size="lg">
                                Cancelar
                            </Button>
                        </Link>
                        <Button type="submit" disabled={isLoading} size="lg" className="min-w-[150px]">
                            {isLoading ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                                    Creando...
                                </>
                            ) : (
                                <>
                                    <Package className="h-4 w-4 mr-2" />
                                    Crear Bien
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Modal de éxito / detalle rápido */}
            <Dialog
                open={showSuccessDialog}
                onOpenChange={(open) => {
                    setShowSuccessDialog(open)
                    if (!open) {
                        // opcional: limpiar asset creado al cerrar manualmente
                        // setCreatedAsset(null)
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-primary" />
                            Bien creado correctamente
                        </DialogTitle>
                        <DialogDescription>El bien se ha registrado en el módulo de activos.</DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 space-y-3 text-sm">
                        <div>
                            <p className="font-medium">Nombre</p>
                            <p className="text-muted-foreground">
                                {createdAsset?.name ?? formData.name ?? "—"}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <p className="font-medium">Código de inventario</p>
                                <p className="text-muted-foreground">
                                    {createdAsset?.inventoryCode ?? formData.inventoryCode ?? "—"}
                                </p>
                            </div>
                            <div>
                                <p className="font-medium">Número de serie</p>
                                <p className="text-muted-foreground">
                                    {createdAsset?.serialNumber ?? formData.serialNumber ?? "—"}
                                </p>
                            </div>
                        </div>
                        <div>
                            <p className="font-medium">Ubicación</p>
                            <p className="text-muted-foreground">
                                {createdAsset?.location ?? formData.location ?? "—"}
                            </p>
                        </div>
                        {createdAsset?._id && (
                            <p className="text-xs text-muted-foreground">
                                ID del bien: <span className="font-mono">{createdAsset._id}</span>
                            </p>
                        )}
                    </div>

                    <div className="mt-6 flex flex-col md:flex-row gap-2 md:justify-end">
                        <Button variant="outline" onClick={handleCreateAnother}>
                            Crear otro bien
                        </Button>
                        <Button variant="ghost" onClick={handleGoToList}>
                            Ir al listado de bienes
                        </Button>
                        <Button onClick={handleGoToDetail}>
                            Ver detalle del bien
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
