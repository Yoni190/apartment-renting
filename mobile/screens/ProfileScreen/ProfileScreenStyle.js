import {StyleSheet} from 'react-native'

export default StyleSheet.create({
  profileTop: {
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 15,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 110 / 2,
    marginBottom: 15,
  },

  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },

  email: {
    fontSize: 14,
    color: "#777",
    marginTop: 5,
  },

  box: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 25,
    paddingVertical: 5,
    borderWidth: 1.3,
    borderColor: "#ddd",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  rowText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
    flex: 1,
  },

  arrow: {
    fontSize: 18,
    color: "#777",
  },

  logoutBtn: {
    flexDirection: "row",
    backgroundColor: "#ffe5e5",
    marginHorizontal: 20,
    paddingVertical: 14,
    marginTop: 25,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },

  logoutText: {
    color: "#d00000",
    fontSize: 16,
    fontWeight: "600",
  },
    // --- Modal Styles ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 10,
    color: '#222',
  },
  modalMessage: {
    textAlign: 'center',
    color: '#555',
    marginTop: 8,
    fontSize: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
});
