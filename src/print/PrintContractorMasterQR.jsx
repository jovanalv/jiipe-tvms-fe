import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const cardStyles = StyleSheet.create({
  page: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    backgroundColor: "#ffffff",
    position: "relative",
  },
  singleCardPage: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "#ffffff",
    position: "relative",
  },
  card: {
    width: "30%",
    height: 170,
    margin: "1.66%",
    padding: 0,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    flexDirection: "column",
    shadowColor: "#1F36C7",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    border: "1px solid #e2e8f0",
  },
  singleCard: {
    width: 480,
    height: 340,
    padding: 0,
    borderRadius: 15,
    backgroundColor: "#ffffff",
    flexDirection: "column",
    shadowColor: "#1F36C7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    border: "2px solid #e2e8f0",
  },
  headerGradient: {
    width: "100%",
    height: 28,
    backgroundColor: "#1F36C7",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  singleHeaderGradient: {
    width: "100%",
    height: 55,
    backgroundColor: "#1F36C7",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  titleContainer: {
    flex: 1,
  },
  contractorName: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 1,
  },
  singleContractorName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 2,
  },
  contractorId: {
    fontSize: 7,
    color: "#e2e8f0",
    opacity: 0.9,
  },
  singleContractorId: {
    fontSize: 12,
    color: "#e2e8f0",
    opacity: 0.9,
  },
  cardBody: {
    padding: 8,
    flex: 1,
    flexDirection: "column",
  },
  singleCardBody: {
    padding: 20,
    flex: 1,
    flexDirection: "column",
  },
  qrContainer: {
    alignItems: "center",
    marginBottom: 6,
  },
  singleQrContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  qrPlaceholder: {
    width: 55,
    height: 55,
    backgroundColor: "#f1f5f9",
    border: "2px solid #1F36C7",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 3,
  },
  singleQrPlaceholder: {
    width: 110,
    height: 110,
    backgroundColor: "#f1f5f9",
    border: "3px solid #1F36C7",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  qrText: {
    fontSize: 6,
    color: "#1F36C7",
    textAlign: "center",
    fontWeight: "bold",
  },
  singleQrText: {
    fontSize: 10,
    color: "#1F36C7",
    textAlign: "center",
    fontWeight: "bold",
  },
  infoContainer: {
    width: "100%",
    flex: 1,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
    paddingHorizontal: 4,
    paddingVertical: 2,
    backgroundColor: "#f8fafc",
    borderRadius: 3,
    borderLeft: "2px solid #1F36C7",
  },
  singleInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    borderLeft: "3px solid #1F36C7",
  },
  infoLabel: {
    fontSize: 7,
    color: "#64748b",
    width: "35%",
    fontWeight: "600",
  },
  singleInfoLabel: {
    fontSize: 14,
    color: "#64748b",
    width: "35%",
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 7,
    color: "#1e293b",
    width: "65%",
    textAlign: "right",
    fontWeight: "500",
  },
  singleInfoValue: {
    fontSize: 14,
    color: "#1e293b",
    width: "65%",
    textAlign: "right",
    fontWeight: "500",
  },
  footer: {
    width: "100%",
    marginTop: "auto",
    paddingTop: 4,
    paddingHorizontal: 8,
    paddingBottom: 4,
    borderTop: "1px solid #e2e8f0",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  singleFooter: {
    width: "100%",
    marginTop: "auto",
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderTop: "2px solid #e2e8f0",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  footerText: {
    fontSize: 6,
    color: "#64748b",
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  singleFooterText: {
    fontSize: 10,
    color: "#64748b",
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: 0.8,
  },
  decorativeElement: {
    position: "absolute",
    top: 35,
    right: -8,
    width: 20,
    height: 20,
    backgroundColor: "#3b82f6",
    borderRadius: 10,
    opacity: 0.1,
  },
  pageNumber: {
    position: "absolute",
    bottom: 8,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 9,
    color: "#64748b",
  },
});

const CARDS_PER_PAGE = 12;

const ContractorCardPDF = ({ contractor, qrImage, isSingle = false }) => (
  <View style={isSingle ? cardStyles.singleCard : cardStyles.card}>
    <View
      style={
        isSingle ? cardStyles.singleHeaderGradient : cardStyles.headerGradient
      }
    >
      <View style={cardStyles.titleContainer}>
        <Text
          style={
            isSingle
              ? cardStyles.singleContractorName
              : cardStyles.contractorName
          }
        >
          {contractor.vendorname}
        </Text>
      </View>
    </View>

    <View style={isSingle ? cardStyles.singleCardBody : cardStyles.cardBody}>
      <View
        style={isSingle ? cardStyles.singleQrContainer : cardStyles.qrContainer}
      >
        {qrImage ? (
          <Image
            src={qrImage}
            style={{
              width: isSingle ? 110 : 55,
              height: isSingle ? 110 : 55,
              borderRadius: isSingle ? 10 : 6,
              border: isSingle ? "3px solid #1F36C7" : "2px solid #1F36C7",
            }}
          />
        ) : (
          <View
            style={
              isSingle
                ? cardStyles.singleQrPlaceholder
                : cardStyles.qrPlaceholder
            }
          >
            <Text
              style={isSingle ? cardStyles.singleQrText : cardStyles.qrText}
            >
              QR CODE{"\n"}
              {contractor.guid}
            </Text>
          </View>
        )}
      </View>

      <View style={cardStyles.infoContainer}>
        <View style={isSingle ? cardStyles.singleInfoRow : cardStyles.infoRow}>
          <Text
            style={isSingle ? cardStyles.singleInfoLabel : cardStyles.infoLabel}
          >
            Name:
          </Text>
          <Text
            style={isSingle ? cardStyles.singleInfoValue : cardStyles.infoValue}
          >
            {contractor.name1}
          </Text>
        </View>
        <View style={isSingle ? cardStyles.singleInfoRow : cardStyles.infoRow}>
          <Text
            style={isSingle ? cardStyles.singleInfoLabel : cardStyles.infoLabel}
          >
            Email:
          </Text>
          <Text
            style={isSingle ? cardStyles.singleInfoValue : cardStyles.infoValue}
          >
            {contractor.email || "No Email Provided"}
          </Text>
        </View>
        <View style={isSingle ? cardStyles.singleInfoRow : cardStyles.infoRow}>
          <Text
            style={isSingle ? cardStyles.singleInfoLabel : cardStyles.infoLabel}
          >
            Phone Number:
          </Text>
          <Text
            style={isSingle ? cardStyles.singleInfoValue : cardStyles.infoValue}
          >
            {contractor.no_hp || "No Phone Number Provided"}
          </Text>
        </View>
      </View>
    </View>

    <View style={isSingle ? cardStyles.singleFooter : cardStyles.footer}>
      <Text
        style={isSingle ? cardStyles.singleFooterText : cardStyles.footerText}
      >
        CONTRACTOR
      </Text>
    </View>
  </View>
);

export const AllContractorsMasterPDF = ({ contractors, qrImages }) => {
  const pages = [];
  for (let i = 0; i < contractors.length; i += CARDS_PER_PAGE) {
    pages.push(contractors.slice(i, i + CARDS_PER_PAGE));
  }

  return (
    <Document>
      {pages?.map((pageContractors, pageIndex) => (
        <Page key={pageIndex} size="A4" style={cardStyles.page}>
          {pageContractors?.map((contractor, index) => (
            <ContractorCardPDF
              key={index}
              contractor={contractor}
              qrImage={qrImages?.[contractor.guid]}
              isSingle={false}
            />
          ))}
          <Text
            style={cardStyles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
            fixed
          />
        </Page>
      ))}
    </Document>
  );
};

export const SingleContractorMasterPDF = ({ contractor, qrImage }) => (
  <Document>
    <Page size="A4" style={cardStyles.singleCardPage}>
      <ContractorCardPDF
        contractor={contractor}
        qrImage={qrImage}
        isSingle={true}
      />
      <Text
        style={cardStyles.pageNumber}
        render={({ pageNumber, totalPages }) =>
          `Page ${pageNumber} of ${totalPages}`
        }
        fixed
      />
    </Page>
  </Document>
);

export default {
  AllContractorsMasterPDF,
  SingleContractorMasterPDF,
};
