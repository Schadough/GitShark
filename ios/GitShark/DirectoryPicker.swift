//
//  DirectoryPicker.swift
//  GitShark
//
//  Created by Corbin Crutchley on 6/27/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

import Foundation

import UIKit
import MobileCoreServices

@objc(DirectoryPicker)
class DirectoryPicker: NSObject, UIDocumentPickerDelegate {

  func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
    print(urls)
  }
  
  func documentPickerWasCancelled(_ controller: UIDocumentPickerViewController) {
    
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    
    let documentPicker =
        UIDocumentPickerViewController(documentTypes: [kUTTypeFolder as String],
                                       in: .open)

    documentPicker.delegate = self

    // Present the document picker.
    self.present(documentPicker, animated: true, completion: nil)
    
    return true
  }
}
