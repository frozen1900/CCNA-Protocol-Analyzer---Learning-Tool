const lang_de = {
    ui: {
        title: "CCNA Protocol Analyzer",
        whyHeader: "Warum & Hintergrund:",
        metricHeader: "Technische Metrik:",
        placeholder: "Wähle ein Element aus dem Diagramm oder einen Button oben aus, um detaillierte CCNA-Informationen zu erhalten.",
        l1: "Layer 1 - Physical Sync",
        l2: "Layer 2 - Data Link Header",
        l3: "Layer 3 - Network Header (IPv4)",
        payload: "Payload & Trailer"
    },

    buttons: [
        { id: "eth_h", label: "Ethernet Header (14 Bytes)" },
        { id: "ip_h", label: "IPv4 Header (20-60 Bytes)" },
        { id: "l2pdu", label: "Layer 2 PDU Frame (64-1518 Bytes)" },
        { id: "l3pdu", label: "Layer 3 PDU Packet (20-65535 Bytes)" },
        { id: "overhead", label: "Total Overhead (12 Bytes)" }
    ],

    fields: {
        pre: {
            t: "Preamble",
            c: "7 Bytes (56 Bits) mit dem Bitmuster 10101010.",
            why: "Bit-Synchronisation: Der Empfänger gleicht seinen internen Takt mit dem Signal des Senders ab.",
            calc: "Wird vor der Verarbeitung des Schicht 2 Frames entfernt."
        },
        sfd: {
            t: "SFD (Start Frame Delimiter)",
            c: "1 Byte (10101011).",
            why: "Markiert das Ende der Synchronisation. Signalisiert: Ab hier beginnt die Ziel-MAC-Adresse.",
            calc: "Letztes Feld vor dem Header."
        },
        dmac: {
            t: "Destination MAC Address",
            c: "Zieladresse der Hardware (6 Bytes). Der Host nutzt hier die MAC seines Default Gateways, um das lokale Netz zu verlassen.",
            why: "Der Rewrite Prozess: Wenn Host A ein Paket an Host B in einem anderen Netz schickt, trägt er als Destination MAC die Adresse seines Routers (G1) ein. Der Router empfängt das Paket, schaut in die IP-Routing-Tabelle und ersetzt die Destination MAC durch die Adresse von Host B (oder den nächsten Router).",
            calc: "Die Ziel-MAC ändert sich bei jedem Router-Übergang."
        },
        smac: {
            t: "Source MAC Address",
            c: "Absender-Hardwareadresse (6 Bytes).",
            why: "Besteht aus OUI und NIC-ID. Beispiel Apple: 00:0A:95:9D:68:16. Der Router setzt seine eigene MAC-Adresse (Ausgangs-Interface G2) als neue Source MAC ein.",
            calc: "Die Quell-MAC wird an jedem Router durch dessen eigene Interface-MAC ersetzt."
        },
        typ: {
            t: "EtherType",
            c: "Identifiziert das Layer 3 Protokoll.",
            why: "Beispiele: 0x0800 (IPv4), 0x0806 (ARP), 0x86DD (IPv6), 0x8100 (VLAN Tagging)",
            calc: "2 Bytes (16 Bits)."
        },
        ver: {
            t: "Version",
            c: "IP-Protokollversion (4 Bits).",
            why: "Beispiele: 4 (Binär 0100) für IPv4, 6 (Binär 0110) für IPv6",
            calc: "Erstes Feld im IP-Header."
        },
        ihl: {
            t: "Internet Header Length (IHL)",
            c: "Länge des Headers in 32-Bit Zeilen (Words).",
            why: "Wichtig bei Optionen, um den Start der Daten zu finden.",
            calc: "Berechnung: IHL-Wert × 4 = Header in Bytes. Min (Standard): 5 (5 × 4 = 20 Bytes). Max (Optionen): 15 (15 × 4 = 60 Bytes)"
        },
        dscp: {
            t: "DSCP (6 Bits)",
            c: "Priorisierung für Quality of Service (QoS).",
            why: "Warum 64 Stufen? Da das Feld 6 Bits groß ist, ergeben sich 2⁶ = 64 Kombinationen. Beispiele: EF (Expedited Forwarding) für VoIP.",
            calc: "Markiert Pakete für Vorrangbehandlung."
        },
        ecn: {
            t: "ECN (2 Bits)",
            c: "Explicit Congestion Notification.",
            why: "Router (Stau) setzt Bits, Empfänger sieht Warnung, Empfänger informiert Sender. Sender-Reaktion: Der Sender reduziert sein Congestion Window (cwnd).",
            calc: "Vermeidet Paketverlust."
        },
        tl: {
            t: "Total Length",
            c: "Gesamtlänge des Pakets (Header + Payload) in Bytes.",
            why: "Feldinhalt ist die Summe: Header + Daten. Beispiel: 20 Bytes Header + 100 Bytes Daten = Total Length 120.",
            calc: "Rechnung zur Datengröße: Total Length − (IHL × 4)."
        },
        id: {
            t: "Identification",
            c: "ID zur Zuordnung von Fragmenten.",
            why: "Alle Fragmente eines zerschnittenen Pakets erhalten dieselbe ID zur Wiedererkennung. Beispiel ID: 4521",
            calc: "Wertebereich (16 Bits): Min: 0, Max: 65.535"
        },
        flg: {
            t: "Flags",
            c: "3 Steuerbits für Fragmentierung.",
            why: "Bit 0: Reserviert (immer 0). Bit 1: DF (Don't Fragment) - Router darf nicht zerlegen. Bit 2: MF (More Fragments) - Zeigt an: Weitere Teile folgen.",
            calc: "3 Bits gesamt."
        },
        off: {
            t: "Fragment Offset",
            c: "Gibt die Position eines Fragments im Gesamtpaket an.",
            why: "Warum 8-Byte Blöcke? Da das Feld nur 13 Bits hat (max. 8192 Werte), das Paket aber 65.535 Bytes groß sein kann, rechnet das Protokoll in 8-Byte Einheiten (8192 × 8 = 65536).",
            calc: "Formel: Offset × 8 = Startbyte."
        },
        ttl: {
            t: "TTL (Time to Live)",
            c: "Hops bis das Paket gelöscht wird.",
            why: "Jeder Router reduziert den Wert um 1. Bei 0 wird das Paket gelöscht und ein ICMP 'Time Exceeded' an den Sender geschickt.",
            calc: "CCNA-Standard: 64."
        },
        pro: {
            t: "Protocol",
            c: "Identifiziert Schicht 4 Protokoll.",
            why: "Beispiele: 1 (ICMP/Ping), 6 (TCP/Web), 17 (UDP/DNS)",
            calc: "8 Bits."
        },
        chk: {
            t: "Header Checksum",
            c: "Fehlerprüfung für den IP-Header.",
            why: "Berechnung: Der Sender addiert alle 16-Bit Wörter des Headers (Einerkomplement). Der Empfänger addiert ebenfalls alles. Bei Fehlern wird das Paket lautlos gelöscht (Silent Drop).",
            calc: "Wird an jedem Router neu berechnet."
        },
        sip: {
            t: "Source IP Address",
            c: "Logische Absenderadresse.",
            why: "Identifiziert den Quell-Host. Bleibt über den Pfad gleich (außer bei NAT am Gateway).",
            calc: "32 Bits (4 Bytes)."
        },
        dip: {
            t: "Destination IP Address",
            c: "Logische Zieladresse.",
            why: "Basis für die Routing-Entscheidung des Routers (Routing-Table-Lookup). Bleibt 'Ende-zu-Ende' gleich.",
            calc: "Identifiziert den endgültigen Host."
        },
        opt: {
            t: "Options",
            c: "Zusatzfunktionen (selten genutzt).",
            why: "Kann für Debugging oder Record-Route genutzt werden. Macht Header-Verarbeitung in Routern langsamer.",
            calc: "0 bis 40 Bytes."
        },
        pad: {
            t: "Padding",
            c: "Füllbits (Nullen) am Header-Ende.",
            why: "Stellt sicher, dass der Header auf einer 32-Bit Grenze endet. Beispiel: Header + Optionen = 50 Bytes, dann werden 2 Bytes Padding angehängt.",
            calc: "Zwingend für IHL-Rechnung."
        },
        pld: {
            t: "Data Payload",
            c: "Die eigentlichen Benutzerdaten (Schichten 4-7).",
            why: "Hier stecken TCP/UDP Segmente und die Anwendungsdaten.",
            calc: "MTU-Limit: 1500 Bytes."
        },
        fcs: {
            t: "FCS (Trailer)",
            c: "Fehlererkennung auf Schicht 2 via CRC-32.",
            why: "Prozess: Sender berechnet CRC über den gesamten Frame. Empfänger rechnet nach. Bei Differenz wird der Frame lautlos gelöscht (Silent Drop).",
            calc: "4 Bytes am Frame-Ende."
        },
        eth_h: {
            t: "Ethernet Header (14 Bytes)",
            c: "LAN-Adressierung.",
            why: "Destination MAC (6 Bytes) + Source MAC (6 Bytes) + Type (2 Bytes).",
            calc: "Zuständig für Hop-zu-Hop Zustellung."
        },
        ip_h: {
            t: "IPv4 Header (20-60 Bytes)",
            c: "Globales Routing.",
            why: "Beinhaltet logische Adressen und QoS.",
            calc: "Min. 20 Bytes (IHL 5)."
        },
        l2pdu: {
            t: "Layer 2 PDU (Frame) (64-1518 Bytes)",
            c: "Switching-Einheit.",
            why: "Warum 64 Bytes? Wegen Slot-Time. Rechnung: 14 Bytes (Header) + 20 Bytes (IP) + 4 Bytes (Trailer) = 38 Bytes. Rest = 26 Bytes Padding.",
            calc: "Ethernet Header + IP-Paket + FCS."
        },
        l3pdu: {
            t: "Layer 3 PDU (Packet) (20-65535 Bytes)",
            c: "Routing-Einheit.",
            why: "Gekapselt im Frame.",
            calc: "IPv4 Header + Payload."
        },
        overhead: {
            t: "Total Overhead (12 Bytes)",
            c: "Steuerungsdaten.",
            why: "8 Bytes L1 Sync + 4 Bytes L2 Checksumme.",
            calc: "12 Bytes Overhead."
        }
    }
};
