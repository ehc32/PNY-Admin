// components/pdf/WorkReportLetterPdf.tsx
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer"
import type { WorkReport } from "@/lib/api/work-report-service"

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingHorizontal: 60,
    paddingBottom: 40,
    fontSize: 11,
    lineHeight: 1.4,
  },
  headerEmpresa: {
    textAlign: "center",
    marginBottom: 6,
  },
  headerEmpresaNombre: {
    fontSize: 14,
    textTransform: "uppercase",
  },
  headerEmpresaSub: {
    fontSize: 11,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginVertical: 10,
  },
  fechaLugar: {
    fontSize: 11,
    textAlign: "right",
    marginBottom: 16,
  },
  tituloCarta: {
    fontSize: 12,
    marginBottom: 10,
    textDecoration: "underline",
    fontWeight: "bold",
  },
  bloqueDatos: {
    marginBottom: 12,
  },
  labelRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  labelTitle: {
    width: 70,
    fontWeight: "bold",
  },
  labelText: {
    flex: 1,
  },
  saludo: {
    marginTop: 8,
    marginBottom: 8,
    fontWeight: "bold",
  },
  parrafo: {
    marginBottom: 8,
    textAlign: "justify",
  },
  despedida: {
    marginTop: 16,
    marginBottom: 24,
  },
  firmaBlock: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  firmaCol: {
    width: "45%",
    alignItems: "center",
  },
  firmaLinea: {
    borderTopWidth: 1,
    borderTopColor: "#000",
    width: "100%",
    marginBottom: 3,
  },
  firmaNombre: {
    fontSize: 11,
  },
  firmaRol: {
    fontSize: 9,
  },
})

interface Props {
  report: WorkReport
}

type OrderSolicitudLite = {
  _id: string
  InventoryCode?: string
  serialNumber?: string
  maintenanceType?: string
  trackingNumber?: string
}

export function WorkReportLetterPdf({ report }: Props) {
  const order = report.orderId
  const tecnico = order?.tecnicoId
  const instructor = order?.instructorId
  const solicitud = order?.solicitud as OrderSolicitudLite | undefined

  const assetCode = solicitud?.InventoryCode ?? "—"
  const serialNumber = solicitud?.serialNumber ?? "—"
  const maintenanceType = solicitud?.maintenanceType ?? "—"

  const fechaCreacion = new Date(report.createdAt)
  const fechaTexto = fechaCreacion.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Encabezado institucional centrado */}
        <View style={styles.headerEmpresa}>
          <Text style={styles.headerEmpresaNombre}>
            SERVICIO NACIONAL DE APRENDIZAJE - SENA
          </Text>
          <Text style={styles.headerEmpresaSub}>
            REGIONAL HUILA
          </Text>
          <Text style={styles.headerEmpresaSub}>
            INFORME TÉCNICO DE TRABAJO DE MANTENIMIENTO
          </Text>
        </View>

        <View style={styles.line} />

        {/* Lugar y fecha a la derecha */}
        <Text style={styles.fechaLugar}>
          Neiva, {fechaTexto}
        </Text>

        {/* Título del documento */}
        <Text style={styles.tituloCarta}>
          INFORME No. {report.Informe}
        </Text>

        {/* Datos tipo “Asunto / Referencia” */}
        <View style={styles.bloqueDatos}>
          <View style={styles.labelRow}>
            <Text style={styles.labelTitle}>Asunto :</Text>
            <Text style={styles.labelText}>
              Informe técnico de mantenimiento del equipo con código de inventario {assetCode}
            </Text>
          </View>
          <View style={styles.labelRow}>
            <Text style={styles.labelTitle}>Ref. :</Text>
            <Text style={styles.labelText}>
              Orden de trabajo {order?.radicado ?? "—"}
            </Text>
          </View>
        </View>

        {/* Saludo */}
        <Text style={styles.saludo}>Señor(a):</Text>
        <Text style={{ marginBottom: 8 }}>
          {instructor?.name ?? "Instructor responsable"}
        </Text>

        {/* Párrafos principales */}
        <Text style={styles.parrafo}>
          Por medio de la presente, me permito informar que se realizaron actividades de
          mantenimiento {maintenanceType.toLowerCase()} sobre el equipo identificado con
          código de inventario {assetCode} y número de serie {serialNumber}.
        </Text>

        <Text style={styles.parrafo}>
          Las labores se ejecutaron en el marco de la orden de trabajo{" "}
          {order?.radicado ?? "—"}, cumpliendo los lineamientos técnicos y de seguridad
          establecidos por el SENA. A continuación, se describen de manera resumida las
          actividades desarrolladas:
        </Text>

        {/* Trabajo realizado */}
        <Text style={styles.parrafo}>
          <Text style={{ fontWeight: "bold" }}>Trabajo realizado: </Text>
          {report.workDone || "—"}
        </Text>

        {/* Horas y costos */}
        <Text style={styles.parrafo}>
          <Text style={{ fontWeight: "bold" }}>Horas empleadas:</Text>{" "}
          {report.hours ?? 0} hora(s).{" "}
          <Text style={{ fontWeight: "bold" }}>Costos estimados:</Text>{" "}
          ${report.costs ?? 0}.
        </Text>

        {/* Observaciones */}
        <Text style={styles.parrafo}>
          <Text style={{ fontWeight: "bold" }}>Observaciones: </Text>
          {report.observation || "—"}
        </Text>

        {/* Respuestas técnicas */}
        <Text style={styles.parrafo}>
          <Text style={{ fontWeight: "bold" }}>Respuestas técnicas: </Text>
          {report.responses || "—"}
        </Text>

        {/* Cierre */}
        <Text style={styles.despedida}>
          Sin otro particular, agradezco la atención prestada y quedo atento a cualquier
          observación o indicación adicional relacionada con la presente intervención.
        </Text>

        <Text>Atentamente,</Text>

        {/* Firmas */}
        <View style={styles.firmaBlock}>
          <View style={styles.firmaCol}>
            <View style={styles.firmaLinea} />
            <Text style={styles.firmaNombre}>{tecnico?.name ?? "________________"}</Text>
            <Text style={styles.firmaRol}>Técnico de mantenimiento</Text>
          </View>
          <View style={styles.firmaCol}>
            <View style={styles.firmaLinea} />
            <Text style={styles.firmaNombre}>{instructor?.name ?? "________________"}</Text>
            <Text style={styles.firmaRol}>Instructor / Aprobador</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}
