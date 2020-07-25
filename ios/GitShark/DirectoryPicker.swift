//
//  DirectoryPicker.swift
//  GitShark
//
//  Created by Corbin Crutchley on 6/27/20.
//  Copyright © 2020 OceanBit. All rights reserved.
//

import UIKit
import MobileCoreServices

@objc(DirectoryPicker)
class DirectoryPicker: NSObject, UIDocumentPickerDelegate {
  
  func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
    print(urls)
  }
  
  func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentAt url: URL) {
  }

  func documentPickerWasCancelled(_ controller: UIDocumentPickerViewController) {

  }

  func pickFolder() -> Bool {

    let documentPicker =
        UIDocumentPickerViewController(documentTypes: [kUTTypeFolder as String],
                                       in: .open)

    documentPicker.delegate = self
    
    let appDelegate  = UIApplication.shared.delegate!
    let viewController = appDelegate.window!!.rootViewController!

    // Present the document picker.
    viewController.present(documentPicker, animated: true, completion: nil)

    return true
  }
}
