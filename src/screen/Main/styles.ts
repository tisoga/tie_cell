import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  printerStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 0.8,
    borderBottomWidth: 0.8,
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10
  },
  ChooseFileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 13,
    marginBottom: 20
  },
  textTitle: {
    fontSize: 30,
    textAlign: 'center'
  },
  textSecondary: {
    textAlign: 'center',
    marginBottom: 3
  },
  textArea: {
    borderColor: 'black',
    borderWidth: 1,
    height: 100
  },
  btnSend: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    borderWidth: 1,
    width: 120,
    height: 35,
    borderRadius: 13
  },
  btnText: {
    color: 'white',
    textAlign: 'center'
  },
  fileNameInput: {
    borderWidth: 0.7,
    height: 40,
    borderRadius: 30,
    paddingHorizontal: 10,
    width: 200
  },
  modalContainer: {
    flex: 1
  },
  modalTitleContainer: {
    borderBottomWidth: 1,
    marginHorizontal: 25
  },
  modalInputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    gap: 20,
    alignItems: 'center',
    paddingTop: 10
  },
  modalTextLabel: {
    fontSize: 20,
    flex: 1.2,
  },
  textInputModal: {
    borderWidth: 1,
    flex: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  resetBtnModal: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textBtnModal: {
    fontSize: 20,
    color: 'black'
  }
})

export default styles