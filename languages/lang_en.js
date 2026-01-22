const lang_en = {
    ui: {
        title: "CCNA Protocol Analyzer",
        whyHeader: "Why & Background:",
        metricHeader: "Technical Metric:",
        placeholder: "Select an element from the diagram or a button above to get detailed CCNA information.",
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
            c: "7 Bytes (56 Bits) with bit pattern 10101010.",
            why: "Bit synchronization: Receiver aligns its internal clock with the sender's signal.",
            calc: "Removed before Layer 2 frame processing."
        },
        sfd: {
            t: "SFD (Start Frame Delimiter)",
            c: "1 Byte (10101011).",
            why: "Marks the end of synchronization. Signals: Destination MAC address starts here.",
            calc: "Last field before the header."
        },
        dmac: {
            t: "Destination MAC Address",
            c: "Hardware destination address (6 Bytes). The host uses its default gateway's MAC to leave the local network.",
            why: "The Rewrite Process: When Host A sends a packet to Host B in another network, it uses its router's (G1) MAC as destination. The router receives the packet, checks the IP routing table, and replaces the destination MAC with Host B's address (or the next router).",
            calc: "The destination MAC changes at every router hop."
        },
        smac: {
            t: "Source MAC Address",
            c: "Sender hardware address (6 Bytes).",
            why: "Consists of OUI and NIC-ID. Example Apple: 00:0A:95:9D:68:16. The router sets its own MAC address (outgoing interface G2) as the new source MAC.",
            calc: "The source MAC is replaced at each router with its own interface MAC."
        },
        typ: {
            t: "EtherType",
            c: "Identifies the Layer 3 protocol.",
            why: "Examples: 0x0800 (IPv4), 0x0806 (ARP), 0x86DD (IPv6), 0x8100 (VLAN Tagging)",
            calc: "2 Bytes (16 Bits)."
        },
        ver: {
            t: "Version",
            c: "IP protocol version (4 Bits).",
            why: "Examples: 4 (Binary 0100) for IPv4, 6 (Binary 0110) for IPv6",
            calc: "First field in the IP header."
        },
        ihl: {
            t: "Internet Header Length (IHL)",
            c: "Header length in 32-bit words.",
            why: "Important with options to find the start of data.",
            calc: "Calculation: IHL value × 4 = header in bytes. Min (standard): 5 (5 × 4 = 20 Bytes). Max (options): 15 (15 × 4 = 60 Bytes)"
        },
        dscp: {
            t: "DSCP (6 Bits)",
            c: "Prioritization for Quality of Service (QoS).",
            why: "Why 64 levels? Since the field is 6 bits, there are 2⁶ = 64 combinations. Examples: EF (Expedited Forwarding) for VoIP.",
            calc: "Marks packets for priority treatment."
        },
        ecn: {
            t: "ECN (2 Bits)",
            c: "Explicit Congestion Notification.",
            why: "Router (congestion) sets bits, receiver sees warning, receiver informs sender. Sender reaction: The sender reduces its congestion window (cwnd).",
            calc: "Avoids packet loss."
        },
        tl: {
            t: "Total Length",
            c: "Total packet length (header + payload) in bytes.",
            why: "Field content is the sum: header + data. Example: 20 Bytes header + 100 Bytes data = Total Length 120.",
            calc: "Calculation for data size: Total Length − (IHL × 4)."
        },
        id: {
            t: "Identification",
            c: "ID for fragment association.",
            why: "All fragments of a fragmented packet receive the same ID for identification. Example ID: 4521",
            calc: "Value range (16 Bits): Min: 0, Max: 65,535"
        },
        flg: {
            t: "Flags",
            c: "3 control bits for fragmentation.",
            why: "Bit 0: Reserved (always 0). Bit 1: DF (Don't Fragment) - router must not fragment. Bit 2: MF (More Fragments) - indicates: more parts follow.",
            calc: "3 bits total."
        },
        off: {
            t: "Fragment Offset",
            c: "Indicates the position of a fragment in the complete packet.",
            why: "Why 8-byte blocks? Since the field is only 13 bits (max. 8192 values), but the packet can be 65,535 bytes large, the protocol calculates in 8-byte units (8192 × 8 = 65536).",
            calc: "Formula: Offset × 8 = start byte."
        },
        ttl: {
            t: "TTL (Time to Live)",
            c: "Hops until the packet is deleted.",
            why: "Each router decrements the value by 1. At 0, the packet is deleted and an ICMP 'Time Exceeded' is sent to the sender.",
            calc: "CCNA standard: 64."
        },
        pro: {
            t: "Protocol",
            c: "Identifies Layer 4 protocol.",
            why: "Examples: 1 (ICMP/Ping), 6 (TCP/Web), 17 (UDP/DNS)",
            calc: "8 Bits."
        },
        chk: {
            t: "Header Checksum",
            c: "Error checking for the IP header.",
            why: "Calculation: The sender adds all 16-bit words of the header (one's complement). The receiver also adds everything. On errors, the packet is silently dropped (Silent Drop).",
            calc: "Recalculated at each router."
        },
        sip: {
            t: "Source IP Address",
            c: "Logical sender address.",
            why: "Identifies the source host. Remains the same along the path (except with NAT at the gateway).",
            calc: "32 Bits (4 Bytes)."
        },
        dip: {
            t: "Destination IP Address",
            c: "Logical destination address.",
            why: "Basis for the router's routing decision (routing table lookup). Remains 'end-to-end' constant.",
            calc: "Identifies the final host."
        },
        opt: {
            t: "Options",
            c: "Additional functions (rarely used).",
            why: "Can be used for debugging or record-route. Slows down header processing in routers.",
            calc: "0 to 40 Bytes."
        },
        pad: {
            t: "Padding",
            c: "Fill bits (zeros) at the end of the header.",
            why: "Ensures that the header ends on a 32-bit boundary. Example: Header + options = 50 Bytes, then 2 Bytes padding are appended.",
            calc: "Required for IHL calculation."
        },
        pld: {
            t: "Data Payload",
            c: "The actual user data (layers 4-7).",
            why: "Contains TCP/UDP segments and application data.",
            calc: "MTU limit: 1500 Bytes."
        },
        fcs: {
            t: "FCS (Trailer)",
            c: "Error detection at Layer 2 via CRC-32.",
            why: "Process: Sender calculates CRC over the entire frame. Receiver recalculates. On difference, the frame is silently dropped (Silent Drop).",
            calc: "4 Bytes at frame end."
        },
        eth_h: {
            t: "Ethernet Header (14 Bytes)",
            c: "LAN addressing.",
            why: "Destination MAC (6 Bytes) + Source MAC (6 Bytes) + Type (2 Bytes).",
            calc: "Responsible for hop-by-hop delivery."
        },
        ip_h: {
            t: "IPv4 Header (20-60 Bytes)",
            c: "Global routing.",
            why: "Contains logical addresses and QoS.",
            calc: "Min. 20 Bytes (IHL 5)."
        },
        l2pdu: {
            t: "Layer 2 PDU (Frame) (64-1518 Bytes)",
            c: "Switching unit.",
            why: "Why 64 Bytes? Because of slot time. Calculation: 14 Bytes (header) + 20 Bytes (IP) + 4 Bytes (trailer) = 38 Bytes. Remainder = 26 Bytes padding.",
            calc: "Ethernet Header + IP packet + FCS."
        },
        l3pdu: {
            t: "Layer 3 PDU (Packet) (20-65535 Bytes)",
            c: "Routing unit.",
            why: "Encapsulated in the frame.",
            calc: "IPv4 Header + Payload."
        },
        overhead: {
            t: "Total Overhead (12 Bytes)",
            c: "Control data.",
            why: "8 Bytes L1 sync + 4 Bytes L2 checksum.",
            calc: "12 Bytes overhead."
        }
    }
};
